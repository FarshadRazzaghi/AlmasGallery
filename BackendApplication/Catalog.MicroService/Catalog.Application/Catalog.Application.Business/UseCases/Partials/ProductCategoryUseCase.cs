using Catalog.Application.Models.Filters;
using Catalog.Application.Models.Requests;
using Catalog.Common;
using Catalog.Common.Exceptions;
using Catalog.Domain.Models;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Data;
using System.Linq.Expressions;
using System.Threading;

namespace Catalog.Application.Business.UseCase;

/// <summary>
/// Implementation of the product category use case, providing methods to manage product categories.
/// </summary>
internal partial class ProductCategoryUseCase : IProductCategoryUseCase
{
    /// <inheritdoc />
    public async Task<(ProductCategory[] list, long totalCount)> GetListAsync(ProductCategoryFilter filter, CancellationToken cancellationToken = default)
    {
        Expression<Func<ProductCategory, bool>> filterExpression = x => true;

        var totalCount = await Repository.GetCountAsync(expression: filterExpression, cancellationToken: cancellationToken);

        var list = await Repository.GetListAsNoTrackingAsync(expression: filterExpression,
                                                             page: filter.Page ?? 1,
                                                             pageSize: filter.PageSize ?? 100,
                                                             includeExpressions: (filter.IncludeCustomFieldGroups ?? true) ? [x => x.ProductCategoryCustomFieldGroups] : [],
                                                             cancellationToken: cancellationToken);

        return (list.ToArray(), totalCount);
    }

    /// <inheritdoc />
    public async Task<ProductCategory?> GetSingleIncludingCustomFieldGroupsAsync(long productCategoryId, CancellationToken cancellationToken = default)
        => await Repository.GetSingleAsync(expression: x => x.Id == productCategoryId,
                                           includeExpressions: [x => x.ProductCategoryCustomFieldGroups],
                                           cancellationToken: cancellationToken);

    /// <inheritdoc />
    public async Task<ProductCategory> CreateAsync(ProductCategoryRequest productCategory, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(productCategory);
        ArgumentException.ThrowIfNullOrEmpty(productCategory.Name);

        using var trans = await Repository.BeginTransactionAsync(cancellationToken);
        try
        {
            var existedCategory = await Repository.GetSingleAsync(x => x.Name == productCategory.Name, cancellationToken);
            if (existedCategory != null)
            {
                throw new DuplicateNameException();
            }

            var category = new ProductCategory()
            {
                Name = productCategory.Name,
                Description = productCategory.Description,
                ParentId = productCategory.ParentId,
                CreatedAt = DateTime.UtcNow,
            };
            Repository.Create(category);

            AddCustomFieldGroups(productCategory, category);

            await trans.CommitAsync(cancellationToken);
            return category;
        }
        catch (Exception)
        {
            await trans.RollbackAsync(cancellationToken);
            throw;
        }
    }

    /// <inheritdoc />
    public async Task<ProductCategory?> UpdateAsync(long productCategoryId, ProductCategoryRequest productCategory, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(productCategory);
        ArgumentException.ThrowIfNullOrEmpty(productCategory.Name);

        using var trans = await Repository.BeginTransactionAsync(cancellationToken);
        try
        {
            var existedCategory = await Repository.GetSingleAsync(expression: x => x.Id == productCategoryId,
                                                                  includeExpressions: [x => x.ProductCategoryCustomFieldGroups],
                                                                  cancellationToken: cancellationToken);
            if (existedCategory == null)
            {
                return null;
            }

            var existedCategoryByName = await Repository.GetSingleAsync(x => x.Name == productCategory.Name && x.Id != productCategoryId, cancellationToken);
            if (existedCategoryByName != null)
            {
                throw new DuplicateNameException();
            }

            existedCategory.Name = productCategory.Name;
            existedCategory.ParentId = productCategory.ParentId;
            existedCategory.Description = productCategory.Description;

            var existedCustomFieldGroups = existedCategory.ProductCategoryCustomFieldGroups.ToArray();
            UnitOfWork.ProductCategoryCustomFieldGroupRepository.DeleteRange([.. existedCustomFieldGroups]);

            AddCustomFieldGroups(productCategory, existedCategory);

            Repository.Update(existedCategory);
            await trans.CommitAsync(cancellationToken);
            return existedCategory;
        }
        catch (Exception)
        {
            await trans.RollbackAsync(cancellationToken);
            throw;
        }
    }

    /// <inheritdoc />
    public async Task<bool> DeleteAsync(long productCategoryId, CancellationToken cancellationToken = default)
    {
        using var trans = await Repository.BeginTransactionAsync(cancellationToken);
        try
        {
            var existedGroup = await Repository.GetSingleAsync(expression: x => x.Id == productCategoryId,
                                                               includeExpressions: [x => x.ProductCategoryCustomFieldGroups, x => x.InverseParent],
                                                               cancellationToken: cancellationToken);
            if (existedGroup == null)
            {
                return false;
            }

            if (existedGroup.InverseParent.Count > 0)
            {
                throw new RelationException($"Can't delete. because it is used as parent for {existedGroup.InverseParent.Count} ProductCategories")
                {
                    RelationMessage = "Children ProductCategory"
                };
            }

            UnitOfWork.ProductCategoryCustomFieldGroupRepository.DeleteRange([.. existedGroup.ProductCategoryCustomFieldGroups]);
            Repository.Delete(existedGroup);
            await trans.CommitAsync(cancellationToken);

            return true;
        }
        catch (Exception)
        {
            await trans.RollbackAsync(cancellationToken);
            throw;
        }
    }

    #region Private Methods
    /// <summary>
    /// Adds custom field groups to the specified product category.
    /// </summary>
    /// <param name="productCategory">The product category request containing custom field groups.</param>
    /// <param name="category">The product category entity to which custom field groups will be added.</param>
    private void AddCustomFieldGroups(ProductCategoryRequest productCategory, ProductCategory category)
    {
        var customFieldGroups = productCategory.CustomFieldGroups.ToArray();
        for (int i = 0; i < customFieldGroups.Length; i++)
        {
            var entity = ToModel(customFieldGroups[i], category);
            var existingChild = category.ProductCategoryCustomFieldGroups.Where(c => c.CustomFieldGroupId == customFieldGroups[i].CustomFieldGroupId && c.ProductCategoryId == category.Id).SingleOrDefault();
            if (existingChild == null)
            {
                category.ProductCategoryCustomFieldGroups.Add(entity);
                UnitOfWork.ProductCategoryCustomFieldGroupRepository.Create(entity);
                customFieldGroups[i].Id = entity.Id;
            }
        }
    }

    /// <summary>
    /// Converts a product category custom field group request to a model entity.
    /// </summary>
    /// <param name="dto">The custom field group request DTO.</param>
    /// <param name="group">The product category entity.</param>
    /// <returns>The converted product category custom field group entity.</returns>
    private static ProductCategoryCustomFieldGroup ToModel(ProductCategoryCustomFieldGroupRequest dto, ProductCategory group)
    {
        return new ProductCategoryCustomFieldGroup()
        {
            ProductCategoryId = group.Id,
            CustomFieldGroupId = dto.CustomFieldGroupId,
            CustomFieldGroupLocation = (byte)dto.CustomFieldGroupLocation,
            IsActive = dto.IsActive,
            DateStamp = DateTime.UtcNow,
            Status = (byte)EntityStatus.Active,
        };
    }
    #endregion Private Methods
}