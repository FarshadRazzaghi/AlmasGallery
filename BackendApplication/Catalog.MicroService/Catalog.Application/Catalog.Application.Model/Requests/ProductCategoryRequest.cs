using FluentValidation;

namespace Catalog.Application.Models.Requests;

/// <summary>
/// Validator for the <see cref="ProductCategoryRequest"/> class.
/// Ensures that the product category request properties meet the required validation rules.
/// </summary>
public class ProductCategoryRequestValidator : AbstractValidator<ProductCategoryRequest>
{
    public ProductCategoryRequestValidator()
    {
        // Ensures the name is not null or empty.
        RuleFor(x => x.Name).NotNull().NotEmpty();

        // Ensures each custom field group in the category is valid according to the ProductCategoryCustomFieldGroupRequestValidator.
        RuleForEach(x => x.CustomFieldGroups).SetValidator(new ProductCategoryCustomFieldGroupRequestValidator());
    }
}

/// <summary>
/// Represents a product category data transfer object.
/// </summary>
public class ProductCategoryRequest
{
    /// <summary>
    /// Gets or sets the name of the product category.
    /// This property is required and cannot be null or empty.
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// Gets or sets the description of the product category.
    /// </summary>
    public string Description { get; set; } = null!;

    /// <summary>
    /// Gets or sets the ID of the parent product category.
    /// </summary>
    public long? ParentId { get; set; }

    /// <summary>
    /// Gets or sets the custom field groups associated with the product category.
    /// </summary>
    public ProductCategoryCustomFieldGroupRequest[] CustomFieldGroups { get; set; } = [];
}
