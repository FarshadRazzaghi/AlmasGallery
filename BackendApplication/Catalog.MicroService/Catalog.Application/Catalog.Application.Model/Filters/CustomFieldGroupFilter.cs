using Catalog.Common;
using FluentValidation;

namespace Catalog.Application.Models.Filters;

/// <summary>
/// Validator for the <see cref="CustomFieldGroupFilter"/> class.
/// Ensures that the filter properties meet the required validation rules.
/// </summary>
public class CustomFieldGroupFilterValidator : AbstractValidator<CustomFieldGroupFilter>
{
    public CustomFieldGroupFilterValidator()
    {
        // Add validation rules here if needed in the future.
    }
}

/// <summary>
/// Represents a filter for custom field groups, including pagination and optional filtering by group type and name.
/// </summary>
public class CustomFieldGroupFilter : PaginationFilter
{
    /// <summary>
    /// Gets or sets a value indicating whether to include custom fields in the filter results.
    /// </summary>
    public bool? IncludeCustomFields { get; set; } = true;

    /// <summary>
    /// Gets or sets the types of custom field groups to filter by.
    /// </summary>
    public CustomFieldGroupEntityType[]? GroupType { get; set; } = [];

    /// <summary>
    /// Gets or sets the names of custom field groups to filter by.
    /// </summary>
    public string[]? GroupName { get; set; } = [];
}