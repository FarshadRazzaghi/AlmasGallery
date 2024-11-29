namespace Catalog.Application.Models;

public class CustomFieldGroupDto
{
    public string GroupName { get; set; } = null!;
    public CustomFieldDto[] Options { get; set; } = [];
}
