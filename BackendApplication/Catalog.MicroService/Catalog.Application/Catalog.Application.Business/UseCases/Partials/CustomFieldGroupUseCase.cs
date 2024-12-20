using Catalog.Application.Models.Filters;
using Catalog.Common;
using Catalog.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;
using System.Linq.Expressions;

namespace Catalog.Application.Business.UseCase;

internal partial class CustomFieldGroupUseCase : ICustomFieldGroupUseCase
{
    public async Task<(CustomFieldGroup[] list, long totalCount)> GetListIncludingCustomFieldsAsync(CustomFieldGroupFilter filter, CancellationToken cancellationToken = default)
    {
        Expression<Func<CustomFieldGroup, bool>> filterExpression = x => true;

        var totalCount = await Repository.GetCountAsync(expression: filterExpression, cancellationToken: cancellationToken);

        var list = await Repository.GetListAsNoTrackingAsync(expression: filterExpression,
                                                             page: filter.Page ?? 1,
                                                             pageSize: filter.PageSize ?? 100,
                                                             includeExpressions: [x => x.CustomFields],
                                                             cancellationToken: cancellationToken);

        return (list.ToArray(), totalCount);
    }

    public async Task<CustomFieldGroup?> GetSingleIncludingCustomFieldsAsync(long Id, CancellationToken cancellationToken = default)
        => await Repository.GetSingleAsync(expression: x => x.Id == Id,
                                           includeExpressions: [x => x.CustomFields],
                                           cancellationToken: cancellationToken);

    public async Task<CustomFieldGroup> CreateAsync(CustomFieldGroupDto customFieldGroup, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(customFieldGroup);
        ArgumentException.ThrowIfNullOrEmpty(customFieldGroup.Name);

        using var trans = await Repository.BeginTransactionAsync(cancellationToken);
        try
        {
            var existedGroup = await Repository.GetSingleAsync(x => x.Name == customFieldGroup.Name, cancellationToken);
            if (existedGroup != null)
            {
                throw new DuplicateNameException();
            }

            var group = new CustomFieldGroup()
            {
                Name = customFieldGroup.Name,
                EntityType = customFieldGroup.EntityType,
            };
            Repository.Create(group);

            AddCustomFields(customFieldGroup, group);

            await trans.CommitAsync(cancellationToken);
            return group;
        }
        catch (Exception)
        {
            await trans.RollbackAsync(cancellationToken);
            throw;
        }
    }

    public async Task<CustomFieldGroup?> UpdateAsync(long customFieldId, CustomFieldGroupDto customFieldGroup, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(customFieldGroup);
        ArgumentException.ThrowIfNullOrEmpty(customFieldGroup.Name);

        using var trans = await Repository.BeginTransactionAsync(cancellationToken);
        try
        {
            var existedGroup = await Repository.GetSingleAsync(expression: x => x.Id == customFieldId,
                                                               includeExpressions: [x => x.CustomFields],
                                                               cancellationToken: cancellationToken);
            if (existedGroup == null)
            {
                return null;
            }

            var existedGroupByName = await Repository.GetSingleAsync(x => x.Name == customFieldGroup.Name && x.Id != customFieldId, cancellationToken);
            if (existedGroupByName != null)
            {
                throw new DuplicateNameException();
            }

            existedGroup.Name = customFieldGroup.Name;
            existedGroup.EntityType = customFieldGroup.EntityType;

            var existedCustomFields = existedGroup.CustomFields.ToArray();
            for (int i = 0; i < existedCustomFields.Length; i++)
            {
                if (!customFieldGroup.CustomFields.Any(c => c.Id == existedCustomFields[i].Id))
                {
                    UnitOfWork.CustomFieldRepository.Delete(existedCustomFields[i]);
                }
            }

            AddCustomFields(customFieldGroup, existedGroup);

            Repository.Update(existedGroup);
            await trans.CommitAsync(cancellationToken);
            return existedGroup;
        }
        catch (Exception)
        {
            await trans.RollbackAsync(cancellationToken);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(long id, CancellationToken cancellationToken = default)
    {
        using var trans = await Repository.BeginTransactionAsync(cancellationToken);
        try
        {
            var existedGroup = await Repository.GetSingleAsync(expression: x => x.Id == id,
                                                               includeExpressions: [x => x.CustomFields],
                                                               cancellationToken: cancellationToken);
            if (existedGroup == null)
            {
                return false;
            }

            UnitOfWork.CustomFieldRepository.DeleteRange([.. existedGroup.CustomFields]);
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

    public EnumAsList<byte>[] GetListOfAvailableTypes()
        => Enum.GetValues(typeof(CustomFieldGroupType))
               .Cast<CustomFieldGroupType>()
               .Select(x => new EnumAsList<byte>
               {
                   Name = $"{x.GetType().Name}.{x}",
                   Value = (byte)x
               })
               .ToArray();

    #region Private Methods
    private void AddCustomFields(CustomFieldGroupDto customFieldGroup, CustomFieldGroup group)
    {
        var options = customFieldGroup.CustomFields.ToArray();
        for (int i = 0; i < options.Length; i++)
        {
            long? parentId = null;
            if (options[i].ParentUniqueId != null)
            {
                var parent = options.FirstOrDefault(x => x.UniqueId == options[i].ParentUniqueId);
                parentId = parent?.Id;
            }
            var entity = ToModel(options[i], group, parentId);

            var existingChild = group.CustomFields.Where(c => c.Id == options[i].Id && c.Id != default(int)).SingleOrDefault();
            if (existingChild == null)
            {
                group.CustomFields.Add(entity);
                UnitOfWork.CustomFieldRepository.Create(entity);
                options[i].Id = entity.Id;
            }
            else
            {
                //existingChild.Name = options[i].Name;
                entity.Id = existingChild.Id;
                UnitOfWork.CustomFieldRepository.Update(entity);
            }
        }
    }

    private static CustomField ToModel(CustomFieldDto dto, CustomFieldGroup group, long? parentId = null)
    {
        return new CustomField()
        {
            CustomFieldGroupId = group.Id,
            Name = dto.Name,
            DataType = dto.DataType,
            InitialValue = dto.InitialValue,
            PlaceHolder = dto.PlaceHolder,
            HelpText = dto.HelpText,
            IsActive = dto.IsActive,
            IsRequired = dto.IsRequired,
            Validation = dto.Validation,
            DateStamp = DateTime.UtcNow,
            Status = (byte)EntityStatus.Active,

            ParentCondition = dto.ParentCondition,
            ParentId = parentId,
        };
    }
    #endregion Private Methods
}