using AlmasGallery.Catalog.Common;
using FluentValidation;

namespace AlmasGallery.Catalog.Application.Models.Requests;

/// <summary>
/// Validator for the <see cref="CustomFieldRequest"/> class.
/// Ensures that the custom field request properties meet the required validation rules.
/// </summary>
public class CustomFieldRequestValidator : AbstractValidator<CustomFieldRequest>
{
    public CustomFieldRequestValidator()
    {
        // Ensures the name is not null or empty.
        RuleFor(x => x.Name).NotNull().NotEmpty();

        // Ensures the data type is not null or empty.
        RuleFor(x => x.DataType).NotNull().NotEmpty();

        // Ensures the unique identifier is not null or empty.
        RuleFor(x => x.UniqueId).NotNull().NotEmpty();
    }
}

/// <summary>
/// Represents a custom field data transfer object.
/// </summary>
public class CustomFieldRequest
{
    /// <summary>
    /// Gets or sets the ID of the custom field.
    /// This property is required and cannot be null or empty.
    /// </summary>
    public long Id { get; set; }

    /// <summary>
    /// Gets or sets the unique identifier of the custom field.
    /// This property is required and cannot be null or empty.
    /// </summary>
    public Guid UniqueId { get; set; }

    /// <summary>
    /// Gets or sets the name of the custom field.
    /// This property is required and cannot be null or empty.
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// Gets or sets the data type of the custom field.
    /// </summary>
    public CustomFieldDataType DataType { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the custom field is active.
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the custom field is required.
    /// </summary>
    public bool IsRequired { get; set; }

    /// <summary>
    /// Gets or sets the help text for the custom field.
    /// </summary>
    public string? HelpText { get; set; }

    /// <summary>
    /// Gets or sets the placeholder text for the custom field.
    /// </summary>
    public string? PlaceHolder { get; set; }

    /// <summary>
    /// Gets or sets the initial value of the custom field.
    /// </summary>
    public string? InitialValue { get; set; }

    /// <summary>
    /// Gets or sets the validation rules for the custom field.
    /// </summary>
    public string? Validation { get; set; }

    /// <summary>
    /// Gets or sets the unique identifier of the parent custom field.
    /// </summary>
    public Guid? ParentUniqueId { get; set; }

    /// <summary>
    /// Gets or sets the parent condition for the custom field.
    /// </summary>
    public string? ParentCondition { get; set; }
}