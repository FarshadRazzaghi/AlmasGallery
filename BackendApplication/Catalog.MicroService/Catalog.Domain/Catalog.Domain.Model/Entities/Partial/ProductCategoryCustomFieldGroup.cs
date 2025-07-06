using System.ComponentModel.DataAnnotations.Schema;

namespace Catalog.Domain.Models;

public partial class ProductCategoryCustomFieldGroup : IBaseEntity
{
    [NotMapped]
    public long Id { get; set; }

    [NotMapped]
    public DateTime DateStamp { get; set; }

    [NotMapped]
    public byte Status { get; set; }
}
