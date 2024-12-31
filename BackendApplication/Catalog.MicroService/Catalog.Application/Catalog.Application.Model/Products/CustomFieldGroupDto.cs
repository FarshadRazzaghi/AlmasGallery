using FluentValidation;

namespace Catalog.Application.Models;

public class CustomFieldGroupDtoValidator : AbstractValidator<CustomFieldGroupDto>
{
    public CustomFieldGroupDtoValidator()
    {
        RuleFor(x => x.GroupName).NotNull().NotEmpty();
        RuleFor(x => x.GroupType).NotNull().NotEmpty();
        RuleForEach(x => x.Options).SetValidator(new CustomFieldDtoValidator());
    }
}

public class CustomFieldGroupDto
{
    public string GroupName { get; set; } = null!;
    public byte GroupType { get; set; }
    public CustomFieldDto[] Options { get; set; } = [];
}
