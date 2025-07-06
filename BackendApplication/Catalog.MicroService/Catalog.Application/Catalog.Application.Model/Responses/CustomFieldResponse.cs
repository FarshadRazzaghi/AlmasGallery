using AlmasGallery.Catalog.Common;

namespace AlmasGallery.Catalog.Application.Models.Responses;

/// <summary>
/// Represents a response object for a custom field.
/// </summary>
public class CustomFieldResponse
{
    /// <summary>
    /// Gets or sets the ID of the custom field.
    /// </summary>
    public long Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the custom field.
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
    /// Gets or sets the ID of the parent custom field.
    /// </summary>
    public long? ParentId { get; set; }

    /// <summary>
    /// Gets or sets the parent condition for the custom field.
    /// </summary>
    public string? ParentCondition { get; set; }
}
