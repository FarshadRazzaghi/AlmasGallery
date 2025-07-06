using AlmasGallery.Catalog.Common;

namespace AlmasGallery.Catalog.Application.Models.Responses;

/// <summary>
/// Represents a response object for a product category custom field group.
/// </summary>
public class ProductCategoryCustomFieldGroupResponse : CustomFieldGroupResponse
{
    /// <summary>
    /// Gets or sets the location type of the custom field group.
    /// </summary>
    public CustomFieldGroupLocationType Location { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the custom field group is active.
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Gets or sets the order in which the custom field group should be displayed or processed.
    /// </summary>
    public int Order { get; set; }
}