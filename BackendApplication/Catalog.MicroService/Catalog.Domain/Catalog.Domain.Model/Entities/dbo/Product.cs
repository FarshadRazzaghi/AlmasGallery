using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlmasGallery.Catalog.Domain.Models;

[Table("Product")]
[Index("ProductCategoryId", "Name", Name = "IX_Product_ProductCategoryId_Name", IsUnique = true)]
public partial class Product : IBaseEntity
{
    [Key]
    public long Id { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateStamp { get; set; }

    public byte Status { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ModifiedAt { get; set; }

    public byte PublishStatus { get; set; }

    [StringLength(128)]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    [StringLength(256)]
    public string? Tags { get; set; }

    [Column("SKU")]
    [StringLength(32)]
    [Unicode(false)]
    public string Sku { get; set; } = null!;

    [StringLength(32)]
    [Unicode(false)]
    public string? BarCode { get; set; }

    public long ProductCategoryId { get; set; }

    public long CreatorId { get; set; }

    public long? ModifierId { get; set; }

    public long VendorId { get; set; }

    public long? CollectionId { get; set; }

    [ForeignKey("ProductCategoryId")]
    [InverseProperty("Products")]
    public virtual ProductCategory ProductCategory { get; set; } = null!;

    [InverseProperty("Product")]
    public virtual ICollection<ProductInventory> ProductInventories { get; set; } = [];

    [InverseProperty("Product")]
    public virtual ICollection<ProductPrice> ProductPrices { get; set; } = [];
}
