namespace Catalog.Application.Models;

public class CustomFieldDto
{
    public byte DataType { get; set; }
    public bool IsActive { get; set; }
    public bool IsRequired { get; set; }

    public string Name { get; set; } = null!;
    public string? HelpText { get; set; } = default!;
    public string? InitialValue { get; set; } = default!;
    public string? Validation { get; set; } = default!;

    public CustomFieldDto[] Children { get; set; } = [];

    public string? CustomFieldParent { get; set; } = default!;
    public string? ParentCondition { get; set; } = default!;
}