namespace Catalog.Application.Models;

public class ProductDto
{
    public byte PublishStatus { get; set; }
    public string Name { get; set; } = null!;
    public string SKU { get; set; } = null!;
    public string? BarCode { get; set; }
    public string? Tags { get; set; }
    public string? Description { get; set; }
    public long VendorId { get; set; }
    public long ProductCategoryId { get; set; }
    public long? CollectionId { get; set; }
}