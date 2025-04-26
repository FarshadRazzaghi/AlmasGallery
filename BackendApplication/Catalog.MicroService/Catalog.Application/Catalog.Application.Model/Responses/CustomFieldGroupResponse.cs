using Catalog.Common;

namespace Catalog.Application.Models.Responses;

/// <summary>
/// Represents a response object for a custom field group.
/// </summary>
public class CustomFieldGroupResponse
{
    public long Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the custom field group.
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// Gets or sets the entity type of the custom field group.
    /// </summary>
    public CustomFieldGroupEntityType EntityType { get; set; }

    /// <summary>
    /// Gets or sets the custom fields associated with the custom field group.
    /// </summary>
    public CustomFieldResponse[] CustomFields { get; set; } = [];
}
