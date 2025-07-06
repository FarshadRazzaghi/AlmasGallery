using FluentValidation;

namespace Catalog.Application.Models.Filters;

/// <summary>
/// Validator for the <see cref="PaginationFilter"/> class.
/// Ensures that pagination properties meet the required validation rules.
/// </summary>
public class PaginationFilterValidator : AbstractValidator<PaginationFilter>
{
    public PaginationFilterValidator()
    {
        // Ensures the page number is greater than or equal to 1.
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);

        // Ensures the page size is between 1 and 1000.
        RuleFor(x => x.PageSize).GreaterThanOrEqualTo(1).LessThanOrEqualTo(1000);
    }
}

/// <summary>
/// Represents a filter for pagination, including page number and page size.
/// </summary>
public class PaginationFilter
{
    /// <summary>
    /// Gets or sets the page number.
    /// This property must be greater than or equal to 1.
    /// </summary>
    public int? Page { get; set; } = 1;

    /// <summary>
    /// Gets or sets the page size.
    /// This property must be between 1 and 1000.
    /// </summary>
    public int? PageSize { get; set; } = 100;
}
