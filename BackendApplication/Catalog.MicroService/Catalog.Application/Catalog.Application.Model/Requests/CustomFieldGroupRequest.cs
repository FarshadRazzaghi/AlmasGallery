using Catalog.Common;
using FluentValidation;

namespace Catalog.Application.Models.Requests;

/// <summary>
/// Validator for the <see cref="CustomFieldGroupRequest"/> class.
/// Ensures that the custom field group request properties meet the required validation rules.
/// </summary>
public class CustomFieldGroupRequestValidator : AbstractValidator<CustomFieldGroupRequest>
{
    public CustomFieldGroupRequestValidator()
    {
        // Ensures the name is not null or empty.
        RuleFor(x => x.Name).NotNull().NotEmpty();

        // Ensures the entity type is not null or empty.
        RuleFor(x => x.EntityType).NotNull().NotEmpty();

        // Ensures each custom field in the group is valid according to the CustomFieldRequestValidator.
        RuleForEach(x => x.CustomFields).SetValidator(new CustomFieldRequestValidator());
    }
}

/// <summary>
/// Represents a custom field group data transfer object.
/// </summary>
/// <example>
/// {
///     "name": "Group Name",
///     "entityType": 1,
///     "customFields": [{
///         "id": 1,
///     }]
/// }
/// </example>
public class CustomFieldGroupRequest
{
    /// <summary>
    /// Gets or sets the name of the custom field group.
    /// This property is required and cannot be null or empty.
    /// </summary>
    /// <example>"Group Name"</example>
    public string Name { get; set; } = null!;

    /// <summary>
    /// Gets or sets the entity type of the custom field group.
    /// This property is required and cannot be null or empty.
    /// </summary>
    /// <example>1</example>
    public CustomFieldGroupEntityType EntityType { get; set; }

    /// <summary>
    /// Gets or sets the custom fields of the custom field group.
    /// Each custom field must be valid according to the <see cref="CustomFieldRequestValidator"/>.
    /// </summary>
    /// <example>
    /// [{
    ///     "id": 1,
    /// }]
    /// </example>
    public CustomFieldRequest[] CustomFields { get; set; } = [];
}
