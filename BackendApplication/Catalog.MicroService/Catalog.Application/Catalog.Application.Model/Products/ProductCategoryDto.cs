using FluentValidation;

namespace Catalog.Application.Models;

/// <summary>
/// Validator for the <see cref="ProductCategoryDto"/> class.
/// </summary>
public class ProductCategoryDtoValidator : AbstractValidator<ProductCategoryDto>
{
    public ProductCategoryDtoValidator()
    {
        RuleFor(x => x.Name).NotNull().NotEmpty();
        RuleForEach(x => x.CustomFieldGroups).SetValidator(new ProductCategoryCustomFieldGroupDtoValidator());
    }
}

/// <summary>
/// Represents a product category data transfer object.
/// </summary>
public class ProductCategoryDto
{
    /// <summary>
    /// Gets or sets the name of the product category.
    /// This property is required and cannot be null or empty.
    /// </summary>
    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public long? ParentId { get; set; }

    public ProductCategoryCustomFieldGroupDto[] CustomFieldGroups { get; set; } = [];
}
