using FluentValidation;

namespace Catalog.Application.Models;

public class CustomFieldGroupDtoValidator : AbstractValidator<CustomFieldGroupDto>
{
    public CustomFieldGroupDtoValidator()
    {
        RuleFor(x => x.Name).NotNull().NotEmpty();
        RuleFor(x => x.EntityType).NotNull().NotEmpty();
        RuleForEach(x => x.CustomFields).SetValidator(new CustomFieldDtoValidator());
    }
}

public class CustomFieldGroupDto
{
    public string Name { get; set; } = null!;
    public byte EntityType { get; set; }
    public CustomFieldDto[] CustomFields { get; set; } = [];
}
