using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Domain.Models;

[Table("ProductCategory")]
[Index("Name", Name = "Index_ProductCategory_Name", IsUnique = true)]
public partial class ProductCategory : IBaseEntity
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

    [StringLength(256)]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public long CreatorId { get; set; }

    public long? ModifierId { get; set; }

    public long? ParentId { get; set; }

    [InverseProperty("Parent")]
    public virtual ICollection<ProductCategory> InverseParent { get; set; } = new List<ProductCategory>();

    [ForeignKey("ParentId")]
    [InverseProperty("InverseParent")]
    public virtual ProductCategory? Parent { get; set; }

    [InverseProperty("ProductCategory")]
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
