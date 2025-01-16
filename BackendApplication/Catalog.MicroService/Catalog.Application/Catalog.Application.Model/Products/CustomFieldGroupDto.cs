using Catalog.Common;
using FluentValidation;

namespace Catalog.Application.Models;

/// <summary>
/// Validator for the <see cref="CustomFieldGroupDto"/> class.
/// </summary>
public class CustomFieldGroupDtoValidator : AbstractValidator<CustomFieldGroupDto>
{
    public CustomFieldGroupDtoValidator()
    {
        RuleFor(x => x.Name).NotNull().NotEmpty();
        RuleFor(x => x.EntityType).NotNull().NotEmpty();
        RuleForEach(x => x.CustomFields).SetValidator(new CustomFieldDtoValidator());
    }
}

/// <summary>
/// Represents a custom field group data transfer object.
/// </summary>
public class CustomFieldGroupDto
{
    /// <summary>
    /// Gets or sets the name of the custom field group.
    /// This property is required and cannot be null or empty.
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// Gets or sets the entity type of the custom field group.
    /// This property is required and cannot be null or empty.
    /// </summary>
    public CustomFieldGroupType EntityType { get; set; }

    /// <summary>
    /// Gets or sets the custom fields of the custom field group.
    /// Each custom field must be valid according to the <see cref="CustomFieldDtoValidator"/>.
    /// </summary>
    public CustomFieldDto[] CustomFields { get; set; } = [];
}
