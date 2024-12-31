using Catalog.Application.Models.Filters;

namespace Catalog.Application.Contract.UseCase;

public partial interface ICustomFieldGroupUseCase : IBaseUseCase<CustomFieldGroup>
{
    Task<(CustomFieldGroup[] list, long totalCount)> GetListIncludingCustomFieldsAsync(CustomFieldGroupFilter filter, CancellationToken cancellationToken = default!);
    Task<CustomFieldGroup?> GetSingleIncludingCustomFieldsAsync(long Id, CancellationToken cancellationToken = default!);
    Task<CustomFieldGroup> CreateAsync(CustomFieldGroupDto customFieldGroup, CancellationToken cancellationToken = default!);
    Task<CustomFieldGroup?> UpdateAsync(long customFieldGroupId, CustomFieldGroupDto customFieldGroup, CancellationToken cancellationToken = default!);
    Task<bool> DeleteAsync(long id, CancellationToken cancellationToken = default!);
    EnumAsList<byte>[] GetListOfAvailableTypes();
}
