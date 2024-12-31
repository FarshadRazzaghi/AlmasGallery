using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Domain.Models;

[Table("Inventory")]
public partial class Inventory : IBaseEntity
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

    [StringLength(128)]
    public string Name { get; set; } = null!;

    public long CreatorId { get; set; }

    public long? ModifierId { get; set; }

    [InverseProperty("Inventory")]
    public virtual ICollection<ProductInventory> ProductInventories { get; set; } = new List<ProductInventory>();
}
