using Catalog.Application.Models.Filters;
using Catalog.Application.Models.Requests;
using Catalog.Common.Exceptions;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq.Expressions;

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

        var query = Repository.GetQueryableAsNoTracking(expression: filterExpression);

        if (filter.IncludeCustomFieldGroups.GetValueOrDefault(true))
        {
            query = query.Include(x => x.ProductCategoryCustomFieldGroups)
                         .ThenInclude(x => x.CustomFieldGroup);
        }

        var page = filter.Page ?? 1;
        var pageSize = filter.PageSize ?? 100;
        query = query.OrderBy(x => x.Id)
                     .Skip((page - 1) * pageSize)
                     .Take(pageSize);

        var list = await query.ToArrayAsync(cancellationToken);

        return (list, totalCount);
    }

    /// <inheritdoc />
    public async Task<(ProductCategory[] list, long totalCount)> GetListForDropdownAsync(ProductCategoryDropdownFilter filter, CancellationToken cancellationToken = default)
    {
        Expression<Func<ProductCategory, bool>> filterExpression = x => true;
        if (filter.ParentId.HasValue)
        {
            filterExpression = filterExpression.And(x => x.Id != filter.ParentId.Value);

            if (filter.RemoveChildren.GetValueOrDefault(false))
            {
                filterExpression = filterExpression.And(x => x.ParentId != filter.ParentId.Value);
            }
        }

        var totalCount = await Repository.GetCountAsync(expression: filterExpression, cancellationToken: cancellationToken);

        var query = Repository.GetQueryableAsNoTracking(expression: filterExpression);

        var page = filter.Page ?? 1;
        var pageSize = filter.PageSize ?? 100;

        query = query.OrderBy(x => x.Id)
                     .Skip((page - 1) * pageSize)
                     .Take(pageSize);

        var list = await query.ToArrayAsync(cancellationToken);

        return (list, totalCount);
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

        using var trans = await UnitOfWork.BeginTransactionAsync(cancellationToken);
        try
        {
            var existedCategory = await Repository.GetSingleAsync(x => x.Name == productCategory.Name, cancellationToken);
            if (existedCategory != null)
            {
                throw new DuplicateNameException();
            }

            var category = new ProductCategory
            {
                Name = productCategory.Name,
                Description = productCategory.Description,
                ParentId = productCategory.ParentId,
                CreatedAt = DateTime.UtcNow,
                ProductCategoryCustomFieldGroups = [.. productCategory.CustomFieldGroups
                                                                      .Select(cf => new ProductCategoryCustomFieldGroup
                                                                      {
                                                                          Order = cf.Order,
                                                                          CustomFieldGroupId = cf.CustomFieldGroupId,
                                                                          CustomFieldGroupLocation = (byte)cf.CustomFieldGroupLocation,
                                                                          IsActive = cf.IsActive,
                                                                      })]
            };

            // فقط Add می‌کنیم، Save بعداً
            Repository.Add(category);

            // Optional: اگه نیاز باشه فرزندان رو هم explicit ثبت کنی
            foreach (var relation in category.ProductCategoryCustomFieldGroups)
            {
                UnitOfWork.ProductCategoryCustomFieldGroupRepository.Add(relation); // فقط Add کن
            }

            await UnitOfWork.SaveChangesAsync(cancellationToken);
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
    public async Task<ProductCategory?> UpdateAsync(long productCategoryId, ProductCategoryRequest productCategory, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(productCategory);
        ArgumentException.ThrowIfNullOrEmpty(productCategory.Name);

        using var trans = await UnitOfWork.BeginTransactionAsync(cancellationToken);
        try
        {
            var category = await Repository.GetSingleAsync(expression: x => x.Id == productCategoryId,
                                                           includeExpressions: [x => x.ProductCategoryCustomFieldGroups],
                                                           cancellationToken: cancellationToken);
            if (category == null)
            {
                return null;
            }

            category.Name = productCategory.Name;
            category.Description = productCategory.Description;
            category.ParentId = productCategory.ParentId;
            category.ModifiedAt = DateTime.UtcNow;

            var existingRelations = category.ProductCategoryCustomFieldGroups.ToList();
            var newRelationsIds = productCategory.CustomFieldGroups.Select(cf => cf.CustomFieldGroupId).ToHashSet();

            foreach (var existing in existingRelations)
            {
                if (!newRelationsIds.Contains(existing.CustomFieldGroupId))
                {
                    UnitOfWork.ProductCategoryCustomFieldGroupRepository.Remove(existing);
                }
            }

            foreach (var newRelation in productCategory.CustomFieldGroups)
            {
                var existingRelation = existingRelations.FirstOrDefault(r => r.CustomFieldGroupId == newRelation.CustomFieldGroupId);
                if (existingRelation == null)
                {
                    var relation = new ProductCategoryCustomFieldGroup
                    {
                        CustomFieldGroupId = newRelation.CustomFieldGroupId,
                        CustomFieldGroupLocation = (byte)newRelation.CustomFieldGroupLocation,
                        IsActive = newRelation.IsActive,
                        ProductCategoryId = category.Id,
                        Order = newRelation.Order,
                    };
                    UnitOfWork.ProductCategoryCustomFieldGroupRepository.Add(relation);
                }
                else
                {
                    existingRelation.CustomFieldGroupLocation = (byte)newRelation.CustomFieldGroupLocation;
                    existingRelation.IsActive = newRelation.IsActive;
                    existingRelation.Order = newRelation.Order;
                    UnitOfWork.ProductCategoryCustomFieldGroupRepository.Modify(existingRelation);
                }
            }

            Repository.Modify(category);

            await UnitOfWork.SaveChangesAsync(cancellationToken);
            await trans.CommitAsync(cancellationToken);

            return category;
        }
        catch
        {
            await trans.RollbackAsync(cancellationToken);
            throw;
        }
    }

    /// <inheritdoc />
    public async Task<bool> DeleteAsync(long productCategoryId, CancellationToken cancellationToken = default)
    {
        using var trans = await UnitOfWork.BeginTransactionAsync(cancellationToken);
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

            foreach (var relation in existedGroup.ProductCategoryCustomFieldGroups)
            {
                UnitOfWork.ProductCategoryCustomFieldGroupRepository.Remove(relation);
            }

            Repository.Remove(existedGroup);

            await UnitOfWork.SaveChangesAsync(cancellationToken);
            await trans.CommitAsync(cancellationToken);

            return true;
        }
        catch
        {
            await trans.RollbackAsync(cancellationToken);
            throw;
        }
    }
}