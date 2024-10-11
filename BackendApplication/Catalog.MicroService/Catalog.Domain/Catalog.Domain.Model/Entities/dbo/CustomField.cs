using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Domain.Models;

[Table("CustomField")]
[Index("CustomFieldGroupId", "Name", Name = "IX_CustomField_CustomFieldGroupId_Name", IsUnique = true)]
public partial class CustomField : IBaseEntity
{
    [Key]
    public long Id { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateStamp { get; set; }

    public byte Status { get; set; }

    [StringLength(128)]
    public string Name { get; set; } = null!;

    public byte ValueType { get; set; }

    public bool IsSingleton { get; set; }

    public bool IsRequired { get; set; }

    public long CustomFieldGroupId { get; set; }

    [ForeignKey("CustomFieldGroupId")]
    [InverseProperty("CustomFields")]
    public virtual CustomFieldGroup CustomFieldGroup { get; set; } = null!;
}
