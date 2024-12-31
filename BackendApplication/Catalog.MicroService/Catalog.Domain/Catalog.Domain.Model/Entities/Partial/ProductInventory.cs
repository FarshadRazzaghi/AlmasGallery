namespace Catalog.Domain.Models;

public partial class ProductInventory : IBaseEntity
{
    public long Id { get; set; }
    public DateTime DateStamp { get; set; }
    public byte Status { get; set; }
}