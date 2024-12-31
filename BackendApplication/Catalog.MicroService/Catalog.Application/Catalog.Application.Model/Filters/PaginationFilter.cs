using FluentValidation;

namespace Catalog.Application.Models.Filters;

public class PaginationFilterValidator : AbstractValidator<PaginationFilter>
{
    public PaginationFilterValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).GreaterThanOrEqualTo(1).LessThanOrEqualTo(1000);
    }
}

public class PaginationFilter
{
    public int? PageSize { get; set; } = 100;
    public int? Page { get; set; } = 1;
}
