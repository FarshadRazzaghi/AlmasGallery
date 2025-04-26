using FluentValidation;

namespace Catalog.Application.Models.Filters;

/// <summary>
/// Validator for the <see cref="ProductCategoryFilter"/> class.
/// Ensures that the filter properties meet the required validation rules.
/// </summary>
public class ProductCategoryFilterValidator : AbstractValidator<ProductCategoryFilter>
{
    public ProductCategoryFilterValidator()
    {
        // Add validation rules here if needed in the future.
    }
}

/// <summary>
/// Represents a filter for product categories, including pagination and optional custom field group inclusion.
/// </summary>
public class ProductCategoryFilter : PaginationFilter
{
    /// <summary>
    /// Gets or sets a value indicating whether to include custom field groups in the filter results.
    /// </summary>
    public bool? IncludeCustomFieldGroups { get; set; }
}