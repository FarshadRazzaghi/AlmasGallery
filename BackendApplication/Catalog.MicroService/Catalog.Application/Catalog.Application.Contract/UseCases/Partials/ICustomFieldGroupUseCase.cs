using Catalog.Application.Models.Filters;

namespace Catalog.Application.Contract.UseCase;

/// <summary>
/// Interface for the custom field group use case.
/// </summary>
public partial interface ICustomFieldGroupUseCase : IBaseUseCase<CustomFieldGroup>
{
    /// <summary>
    /// Gets a list of custom field groups including their custom fields based on the provided filter.
    /// </summary>
    /// <param name="filter">The filter to apply.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A tuple containing the list of custom field groups and the total count.</returns>
    Task<(CustomFieldGroup[] list, long totalCount)> GetListIncludingCustomFieldsAsync(CustomFieldGroupFilter filter, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Gets a single custom field group including its custom fields by ID.
    /// </summary>
    /// <param name="customFieldGroupId">The ID of the custom field group.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The custom field group if found; otherwise, null.</returns>
    Task<CustomFieldGroup?> GetSingleIncludingCustomFieldsAsync(long customFieldGroupId, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Creates a new custom field group.
    /// </summary>
    /// <param name="customFieldGroup">The custom field group DTO.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The created custom field group.</returns>
    Task<CustomFieldGroup> CreateAsync(CustomFieldGroupDto customFieldGroup, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Updates an existing custom field group.
    /// </summary>
    /// <param name="customFieldGroupId">The ID of the custom field group to update.</param>
    /// <param name="customFieldGroup">The custom field group DTO.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The updated custom field group if found; otherwise, null.</returns>
    Task<CustomFieldGroup?> UpdateAsync(long customFieldGroupId, CustomFieldGroupDto customFieldGroup, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Deletes a custom field group by ID.
    /// </summary>
    /// <param name="customFieldGroupId">The ID of the custom field group to delete.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>True if the custom field group was deleted; otherwise, false.</returns>
    Task<bool> DeleteAsync(long customFieldGroupId, CancellationToken cancellationToken = default!);
}
