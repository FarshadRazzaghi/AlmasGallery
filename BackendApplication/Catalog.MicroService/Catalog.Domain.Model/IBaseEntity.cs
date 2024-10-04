namespace Catalog.Domain.Models;

public partial interface IBaseEntity
{
    long Id { get; set; }
    DateTime DateStamp { get; set; }
    DateTime CreatedAt { get; set; }
    DateTime? ModifiedAt { get; set; }
    byte Status { get; set; }
}
