using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlmasGallery.Catalog.Domain.Models;

[Table("User")]
public partial class User : IBaseEntity
{
    [Key]
    public long Id { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateStamp { get; set; }

    public byte Status { get; set; }

    [StringLength(256)]
    public string FirstName { get; set; } = null!;

    [StringLength(256)]
    public string? LastName { get; set; }

    [StringLength(256)]
    public string UserName { get; set; } = null!;

    [StringLength(1024)]
    public string? Password { get; set; }

    public bool IsActive { get; set; }
}
