using FluentValidation;

namespace Catalog.Application.Models.Filters;

/// <summary>
/// Validator for the <see cref="ProductCategoryFilter"/> class.
/// </summary>
public class ProductCategoryFilterValidator : AbstractValidator<ProductCategoryFilter>
{
    public ProductCategoryFilterValidator()
    {
    }
}

/// <summary>
/// Represents a filter for product categories.
/// </summary>
public class ProductCategoryFilter : PaginationFilter
{
    public bool? IncludeCustomFieldGroups { get; set; }
}