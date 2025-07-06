using FluentValidation;

namespace AlmasGallery.Catalog.Application.Models.Filters;

/// <summary>
/// Validator for the <see cref="ProductCategoryDropdownFilter"/> class.
/// Ensures that the filter properties meet the required validation rules.
/// </summary>
public class ProductCategoryDropdownFilterValidator : AbstractValidator<ProductCategoryDropdownFilter>
{
    public ProductCategoryDropdownFilterValidator()
    {
        // Add validation rules here if needed in the future.
    }
}

/// <summary>
/// Represents a filter for product categories dropdown, including pagination and optional custom field group inclusion.
/// </summary>
public class ProductCategoryDropdownFilter : PaginationFilter
{
    /// <summary>
    /// Gets or sets the ID of the parent category to filter by.
    /// If set, only categories with the specified parent will be included in the result.
    /// </summary>
    public long? ParentId { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether to remove child categories from the result.
    /// If set to true, only top-level categories will be returned.
    /// </summary>
    public bool? RemoveChildren { get; set; }
}