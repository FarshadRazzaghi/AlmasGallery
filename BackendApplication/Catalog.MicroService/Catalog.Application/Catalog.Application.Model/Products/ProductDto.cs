namespace Catalog.Application.Models;

/// <summary>
/// Represents a product data transfer object.
/// </summary>
public class ProductDto
{
    /// <summary>
    /// Gets or sets the publish status of the product.
    /// </summary>
    public byte PublishStatus { get; set; }

    /// <summary>
    /// Gets or sets the name of the product.
    /// This property is required and cannot be null or empty.
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// Gets or sets the SKU (Stock Keeping Unit) of the product.
    /// This property is required and cannot be null or empty.
    /// </summary>
    public string SKU { get; set; } = null!;

    /// <summary>
    /// Gets or sets the barcode of the product.
    /// </summary>
    public string? BarCode { get; set; }

    /// <summary>
    /// Gets or sets the tags associated with the product.
    /// </summary>
    public string? Tags { get; set; }

    /// <summary>
    /// Gets or sets the description of the product.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Gets or sets the ID of the vendor associated with the product.
    /// </summary>
    public long VendorId { get; set; }

    /// <summary>
    /// Gets or sets the ID of the product category.
    /// </summary>
    public long ProductCategoryId { get; set; }

    /// <summary>
    /// Gets or sets the ID of the collection to which the product belongs.
    /// </summary>
    public long? CollectionId { get; set; }
}
