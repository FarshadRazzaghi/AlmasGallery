using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlmasGallery.Catalog.Domain.Models;

[PrimaryKey("ProductId", "InventoryId")]
[Table("ProductInventory")]
public partial class ProductInventory : IBaseEntity
{
    [Column(TypeName = "datetime")]
    public DateTime ModifiedAt { get; set; }

    public long Quantity { get; set; }

    public long? ModifierId { get; set; }

    [Key]
    public long ProductId { get; set; }

    [Key]
    public long InventoryId { get; set; }

    [ForeignKey("InventoryId")]
    [InverseProperty("ProductInventories")]
    public virtual Inventory Inventory { get; set; } = null!;

    [ForeignKey("ProductId")]
    [InverseProperty("ProductInventories")]
    public virtual Product Product { get; set; } = null!;
}
