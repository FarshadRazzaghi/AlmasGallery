using Catalog.Common;
using FluentValidation;

namespace Catalog.Application.Models.Requests;

/// <summary>
/// Validator for the <see cref="ProductCategoryCustomFieldGroupRequest"/> class.
/// Ensures that the product category custom field group request properties meet the required validation rules.
/// </summary>
public class ProductCategoryCustomFieldGroupRequestValidator : AbstractValidator<ProductCategoryCustomFieldGroupRequest>
{
    public ProductCategoryCustomFieldGroupRequestValidator()
    {
        // Ensures the custom field group location is not null or empty.
        RuleFor(x => x.CustomFieldGroupLocation).NotNull().NotEmpty();
    }
}

/// <summary>
/// Represents a product category custom field group data transfer object.
/// </summary>
public class ProductCategoryCustomFieldGroupRequest
{
    /// <summary>
    /// Gets or sets the ID of the product category custom field group.
    /// </summary>
    public long Id { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the custom field group is active.
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Gets or sets the ID of the custom field group.
    /// </summary>
    public long CustomFieldGroupId { get; set; }

    /// <summary>
    /// Gets or sets the location type of the custom field group.
    /// </summary>
    public CustomFieldGroupLocationType CustomFieldGroupLocation { get; set; }
}