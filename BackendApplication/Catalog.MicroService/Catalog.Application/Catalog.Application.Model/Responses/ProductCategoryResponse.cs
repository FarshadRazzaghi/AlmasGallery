namespace Catalog.Application.Models.Responses;

/// <summary>
/// Represents a response object for a product category.
/// </summary>
public class ProductCategoryResponse
{
    /// <summary>
    /// Gets or sets the ID of the product category.
    /// </summary>
    public long Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the product category.
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// Gets or sets the description of the product category.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Gets or sets the ID of the parent product category.
    /// </summary>
    public long? ParentId { get; set; }

    /// <summary>
    /// Gets or sets the custom field groups associated with the product category.
    /// </summary>
    public ProductCategoryCustomFieldGroupResponse[] CustomFieldGroups { get; set; } = [];
}
