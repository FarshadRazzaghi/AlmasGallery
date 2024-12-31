using FluentValidation;

namespace Catalog.Application.Models;

public class CustomFieldDtoValidator : AbstractValidator<CustomFieldDto>
{
    public CustomFieldDtoValidator()
    {
        RuleFor(x => x.Name).NotNull().NotEmpty();
        RuleFor(x => x.DataType).NotNull().NotEmpty();
    }
}

public class CustomFieldDto
{
    public string Name { get; set; } = null!;

    public byte DataType { get; set; }
    public bool IsActive { get; set; }
    public bool IsRequired { get; set; }

    public string? HelpText { get; set; }
    public string? PlaceHolder { get; set; }
    public string? InitialValue { get; set; }
    public string? Validation { get; set; }

    public string? ParentCondition { get; set; }

    public CustomFieldDto[] Children { get; set; } = [];
}