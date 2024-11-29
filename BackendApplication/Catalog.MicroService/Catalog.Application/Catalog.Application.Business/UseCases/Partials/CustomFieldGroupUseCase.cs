using Catalog.Common;

namespace Catalog.Application.Business.UseCase;

internal partial class CustomFieldGroupUseCase : ICustomFieldGroupUseCase
{
    public async Task<CustomFieldGroup> CreateAsync(CustomFieldGroupDto customFieldGroup, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(customFieldGroup);
        ArgumentException.ThrowIfNullOrEmpty(customFieldGroup.GroupName);
        using var trans = await Repository.BeginTransactionAsync(cancellationToken);
        try
        {
            var group = new CustomFieldGroup()
            {
                Name = customFieldGroup.GroupName,
                EntityType = 1,
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
        catch (Exception)
        {
            await trans.RollbackAsync(cancellationToken);
            throw;
        }
    }

    public Task<CustomFieldGroup?> UpdateAsync(long customFieldId, CustomFieldGroupDto CustomField, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
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