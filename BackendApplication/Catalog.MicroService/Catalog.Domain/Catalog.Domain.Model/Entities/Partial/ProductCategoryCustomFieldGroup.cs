namespace Catalog.Domain.Models;

public partial class ProductCategoryCustomFieldGroup : IBaseEntity
{
    public long Id { get; set; }
    public DateTime DateStamp { get; set; }
    public byte Status { get; set; }
}
