using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlmasGallery.Catalog.Domain.Models;

[Table("ProductPrice")]
public partial class ProductPrice : IBaseEntity
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

    [Column(TypeName = "decimal(18, 5)")]
    public decimal Price { get; set; }

    [StringLength(8)]
    [Unicode(false)]
    public string LocalizationIso { get; set; } = null!;

    public bool ApplyTax { get; set; }

    public long CreatorId { get; set; }

    public long? ModifierId { get; set; }

    public long ProductId { get; set; }

    [ForeignKey("ProductId")]
    [InverseProperty("ProductPrices")]
    public virtual Product Product { get; set; } = null!;
}
