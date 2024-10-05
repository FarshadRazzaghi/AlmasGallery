using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Domain.Models;

[Table("Product")]
[Index("Name", "ProductCategoryId", Name = "Index_Product_Name_ProductCategoryId", IsUnique = true)]
public partial class Product : IBaseEntity
{
    [Key]
    public long Id { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateStamp { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ModifiedAt { get; set; }

    public byte Status { get; set; }

    public byte PublishStatus { get; set; }

    [StringLength(128)]
    public string Name { get; set; } = null!;

    [Column("SKU")]
    [StringLength(32)]
    [Unicode(false)]
    public string Sku { get; set; } = null!;

    public int Quantity { get; set; }

    public double BasePrice { get; set; }

    public double? DiscountPrice { get; set; }

    [StringLength(128)]
    [Unicode(false)]
    public string? Identifier { get; set; }

    [StringLength(32)]
    [Unicode(false)]
    public string? BarCode { get; set; }

    [StringLength(256)]
    public string? GlobalDeliveryCountries { get; set; }

    [StringLength(256)]
    public string? Tags { get; set; }

    public string? Description { get; set; }

    public string? Variants { get; set; }

    [Unicode(false)]
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

    [Column(TypeName = "datetime")]
    public DateTime? ExpiryDate { get; set; }

    public long ProductCategoryId { get; set; }

    public long CreatorId { get; set; }

    public long? ModifierId { get; set; }

    public long VendorId { get; set; }

    public long? CollectionId { get; set; }

    [ForeignKey("ProductCategoryId")]
    [InverseProperty("Products")]
    public virtual ProductCategory ProductCategory { get; set; } = null!;
}
