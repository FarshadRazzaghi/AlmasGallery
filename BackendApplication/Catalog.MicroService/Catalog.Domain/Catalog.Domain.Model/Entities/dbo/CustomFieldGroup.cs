using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Domain.Models;

[Table("CustomFieldGroup")]
public partial class CustomFieldGroup : IBaseEntity
{
    [Key]
    public long Id { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateStamp { get; set; }

    public byte Status { get; set; }

    [StringLength(128)]
    public string Name { get; set; } = null!;

    public byte EntityType { get; set; }

    [InverseProperty("CustomFieldGroup")]
    public virtual ICollection<CustomField> CustomFields { get; set; } = new List<CustomField>();

    [InverseProperty("CustomFieldGroup")]
    public virtual ICollection<ProductCategoryCustomFieldGroup> ProductCategoryCustomFieldGroups { get; set; } = new List<ProductCategoryCustomFieldGroup>();
}
