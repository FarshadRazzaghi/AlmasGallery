using FluentValidation;

namespace Catalog.Application.Models.Filters;

/// <summary>
/// Validator for the <see cref="CustomFieldGroupFilter"/> class.
/// </summary>
public class CustomFieldGroupFilterValidator : AbstractValidator<CustomFieldGroupFilter>
{
    public CustomFieldGroupFilterValidator()
    {
    }
}

/// <summary>
/// Represents a filter for custom field groups.
/// </summary>
public class CustomFieldGroupFilter : PaginationFilter
{
    public bool? IncludeCustomFields { get; set; } = true;

    /// <summary>
    /// Gets or sets the group type.
    /// </summary>
    public byte? GroupType { get; set; }

    /// <summary>
    /// Gets or sets the group name.
    /// </summary>
    public string? GroupName { get; set; }
}