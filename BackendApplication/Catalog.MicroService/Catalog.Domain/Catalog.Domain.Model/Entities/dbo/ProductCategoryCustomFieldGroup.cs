using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlmasGallery.Catalog.Domain.Models;

[PrimaryKey("ProductCategoryId", "CustomFieldGroupId")]
[Table("ProductCategoryCustomFieldGroup")]
public partial class ProductCategoryCustomFieldGroup : IBaseEntity
{
    [Key]
    public long ProductCategoryId { get; set; }

    [Key]
    public long CustomFieldGroupId { get; set; }

    public byte CustomFieldGroupLocation { get; set; }

    public bool IsActive { get; set; }

    public int? Order { get; set; }

    [ForeignKey("CustomFieldGroupId")]
    [InverseProperty("ProductCategoryCustomFieldGroups")]
    public virtual CustomFieldGroup CustomFieldGroup { get; set; } = null!;

    [ForeignKey("ProductCategoryId")]
    [InverseProperty("ProductCategoryCustomFieldGroups")]
    public virtual ProductCategory ProductCategory { get; set; } = null!;
}
