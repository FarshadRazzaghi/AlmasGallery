namespace Catalog.Application.Model;

public class AddProductDto
{
    public byte PublishStatus { get; set; }
    public string Name { get; set; } = null!;
    public string SKU { get; set; } = null!;
    public int Quantity { get; set; }
    public double BasePrice { get; set; }
    public double? DiscountPrice { get; set; }
    public string? Identifier { get; set; }
    public string? BarCode { get; set; }
    public string? GlobalDeliveryCountries { get; set; }
    public string? Tags { get; set; }
    public string? Description { get; set; }
    public string? Variants { get; set; }
    public string? Image { get; set; }
    public bool? IsFragile { get; set; }
    public bool? IsBiodegradable { get; set; }
    public bool? IsFrozen { get; set; }
    public bool? IsInStock { get; set; }
    public bool? HasExpiryDate { get; set; }
    public bool? HasChargeTax { get; set; }
    public int? AllowedTemperature { get; set; }
    public byte? ShippingType { get; set; }
    public byte? IdentifierType { get; set; }
    public byte? GlobalDeliveryType { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public long VendorId { get; set; }
    public long CategoryId { get; set; }
    public long? CollectionId { get; set; }
}
