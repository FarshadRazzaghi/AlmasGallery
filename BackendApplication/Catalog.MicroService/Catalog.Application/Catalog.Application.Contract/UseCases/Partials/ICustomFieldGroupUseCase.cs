using Catalog.Application.Models.Requests;
using Catalog.Application.Models.Filters;

namespace Catalog.Application.Contract.UseCase;

/// <summary>
/// Interface for the custom field group use case.
/// </summary>
public partial interface ICustomFieldGroupUseCase : IBaseUseCase<CustomFieldGroup>
{
    /// <summary>
    /// Gets a list of custom field groups based on the provided filter.
    /// </summary>
    /// <param name="filter">The filter to apply.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains a tuple where:
    /// - The first item is an array of custom field groups.
    /// - The second item is the total count of custom field groups.
    /// </returns>
    Task<(CustomFieldGroup[] list, long totalCount)> GetListAsync(CustomFieldGroupFilter filter, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Gets a single custom field group including its custom fields by ID.
    /// </summary>
    /// <param name="customFieldGroupId">The ID of the custom field group.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the custom field group if found; otherwise, null.
    /// </returns>
    Task<CustomFieldGroup?> GetSingleIncludingCustomFieldsAsync(long customFieldGroupId, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Creates a new custom field group.
    /// </summary>
    /// <param name="customFieldGroup">The custom field group DTO.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the created custom field group.
    /// </returns>
    Task<CustomFieldGroup> CreateAsync(CustomFieldGroupRequest customFieldGroup, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Updates an existing custom field group.
    /// </summary>
    /// <param name="customFieldGroupId">The ID of the custom field group to update.</param>
    /// <param name="customFieldGroup">The custom field group DTO.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the updated custom field group if found; otherwise, null.
    /// </returns>
    Task<CustomFieldGroup?> UpdateAsync(long customFieldGroupId, CustomFieldGroupRequest customFieldGroup, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Deletes a custom field group by ID.
    /// </summary>
    /// <param name="customFieldGroupId">The ID of the custom field group to delete.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result is true if the custom field group was deleted; otherwise, false.
    /// </returns>
    Task<bool> DeleteAsync(long customFieldGroupId, CancellationToken cancellationToken = default!);
}
