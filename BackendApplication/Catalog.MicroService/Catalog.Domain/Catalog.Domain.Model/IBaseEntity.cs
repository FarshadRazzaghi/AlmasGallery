namespace AlmasGallery.Catalog.Domain.Models;

public partial interface IBaseEntity
{
    long Id { get; set; }
    DateTime DateStamp { get; set; }
    byte Status { get; set; }
}
