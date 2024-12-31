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
        => await Repository.GetSingleAsync(expression: x => true,
                                           includeExpressions: [x => x.CustomFields],
                                           cancellationToken: cancellationToken);

    public async Task<CustomFieldGroup> CreateAsync(CustomFieldGroupDto customFieldGroup, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(customFieldGroup);
        ArgumentException.ThrowIfNullOrEmpty(customFieldGroup.GroupName);

        using var trans = await Repository.BeginTransactionAsync(cancellationToken);
        try
        {
            var existedGroup = await Repository.GetSingleAsync(x => x.Name == customFieldGroup.GroupName, cancellationToken);
            if (existedGroup != null)
            {
                throw new DuplicateNameException();
            }

            var group = new CustomFieldGroup()
            {
                Name = customFieldGroup.GroupName,
                EntityType = customFieldGroup.GroupType,
            };
            Repository.Create(group);

            var options = customFieldGroup.Options;
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
                    Validation = customField.Validation,
                    ValueType = customField.DataType,
                    InverseParent = customField.Children
                                               .Select(c => new CustomField()
                                               {
                                                   CustomFieldGroupId = group.Id,
                                                   InitialValue = c.InitialValue,
                                                   HelpText = c.HelpText,
                                                   Name = c.Name,
                                                   IsRequired = c.IsRequired,
                                                   Validation = c.Validation,
                                                   ValueType = c.DataType,
                                                   DateStamp = DateTime.UtcNow,
                                                   Status = (byte)Common.EntityStatus.Active,
                                               })
                                               .ToArray()
                };
                UnitOfWork.CustomFieldRepository.Create(entity);
                group.CustomFields.Add(entity);
            }

            await trans.CommitAsync(cancellationToken);
            return group!;
        }
        catch (Exception ex)
        {
            await trans.RollbackAsync(cancellationToken);
            throw;
        }
    }

    public Task<CustomFieldGroup?> UpdateAsync(long customFieldId, CustomFieldGroupDto CustomField, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
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
}