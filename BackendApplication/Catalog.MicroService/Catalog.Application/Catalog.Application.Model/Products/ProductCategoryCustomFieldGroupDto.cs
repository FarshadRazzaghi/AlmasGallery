using Catalog.Common;
using FluentValidation;

namespace Catalog.Application.Models;

/// <summary>
/// Validator for the <see cref="ProductCategoryCustomFieldGroupDto"/> class.
/// </summary>
public class ProductCategoryCustomFieldGroupDtoValidator : AbstractValidator<ProductCategoryCustomFieldGroupDto>
{
    public ProductCategoryCustomFieldGroupDtoValidator()
    {
        RuleFor(x => x.CustomFieldGroupLocation).NotNull().NotEmpty();
    }
}

public class ProductCategoryCustomFieldGroupDto
{
    public long Id { get; set; }
    public bool IsActive { get; set; }
    public long CustomFieldGroupId { get; set; }
    public CustomFieldGroupLocationType CustomFieldGroupLocation { get; set; }
}