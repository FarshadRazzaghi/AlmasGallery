namespace Catalog.Application.Contract.UseCase;

public partial interface ICustomFieldGroupUseCase : IBaseUseCase<CustomFieldGroup>
{
    Task<CustomFieldGroup> CreateAsync(CustomFieldGroupDto customFieldGroup, CancellationToken cancellationToken = default!);
    Task<CustomFieldGroup?> UpdateAsync(long customFieldGroupId, CustomFieldGroupDto customFieldGroup, CancellationToken cancellationToken = default!);
    EnumAsList<byte>[] GetListOfAvailableTypes();
}
