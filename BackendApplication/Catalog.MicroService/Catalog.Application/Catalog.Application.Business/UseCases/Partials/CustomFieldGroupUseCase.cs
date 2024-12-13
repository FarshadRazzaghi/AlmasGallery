using Catalog.Application.Models.Filters;
using Catalog.Common;
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
                UnitOfWork.CustomFieldRepository.Delete(new CustomField() { Id = existedCustomFields[i].Id });
            }

            AddCustomFields(customFieldGroup, existedGroup);

            Repository.Update(existedGroup);
            await trans.CommitAsync(cancellationToken);
            return existedGroup;
        }
        catch (Exception ex)
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

    private void AddCustomFields(CustomFieldGroupDto customFieldGroup, CustomFieldGroup group)
    {
        var options = customFieldGroup.CustomFields;
        for (int i = 0; i < options.Length; i++)
        {
            var customField = options[i];
            var entity = new CustomField()
            {
                CustomFieldGroupId = group.Id,
                InitialValue = customField.InitialValue,
                HelpText = customField.HelpText,
                PlaceHolder = customField.PlaceHolder,
                Name = customField.Name,
                IsRequired = customField.IsRequired,
                IsActive = customField.IsActive,
                Validation = customField.Validation,
                DataType = customField.DataType,
                InverseParent = customField.Children
                                           .Select(c => new CustomField()
                                           {
                                               CustomFieldGroupId = group.Id,
                                               InitialValue = c.InitialValue,
                                               HelpText = c.HelpText,
                                               Name = c.Name,
                                               IsActive = c.IsActive,
                                               IsRequired = c.IsRequired,
                                               Validation = c.Validation,
                                               DataType = c.DataType,
                                               DateStamp = DateTime.UtcNow,
                                               Status = (byte)EntityStatus.Active,
                                           })
                                           .ToArray()
            };

            group.CustomFields.Add(entity);
            UnitOfWork.CustomFieldRepository.Create(entity);
        }
    }
}