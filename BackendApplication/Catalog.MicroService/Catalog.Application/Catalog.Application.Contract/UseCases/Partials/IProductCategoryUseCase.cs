using Catalog.Application.Models.Filters;
using Catalog.Application.Models.Requests;

namespace Catalog.Application.Contract.UseCase;

/// <summary>
/// Interface for the product category use case.
/// </summary>
public partial interface IProductCategoryUseCase : IBaseUseCase<ProductCategory>
{
    /// <summary>
    /// Gets a list of product categories based on the provided filter.
    /// </summary>
    /// <param name="filter">The filter to apply.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains a tuple where:
    /// - The first item is an array of product categories.
    /// - The second item is the total count of product categories.
    /// </returns>
    Task<(ProductCategory[] list, long totalCount)> GetListAsync(ProductCategoryFilter filter, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Gets a list of product categories for use in dropdowns, based on the provided filter.
    /// Supports pagination and filtering by parent category or other optional conditions.
    /// </summary>
    /// <param name="filter">The filter used to determine which product categories to include in the dropdown.</param>
    /// <param name="cancellation">A token to monitor for cancellation requests.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains a tuple where:
    /// - The first item is an array of filtered product categories.
    /// - The second item is the total count of matching product categories (useful for paginated dropdowns).
    /// </returns>
    Task<(ProductCategory[] list, long totalCount)> GetListForDropdownAsync(ProductCategoryDropdownFilter filter, CancellationToken cancellation = default!);

    /// <summary>
    /// Gets a single product category including its custom field groups by ID.
    /// </summary>
    /// <param name="productCategoryId">The ID of the product category.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the product category if found; otherwise, null.
    /// </returns>
    Task<ProductCategory?> GetSingleIncludingCustomFieldGroupsAsync(long productCategoryId, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Creates a new product category.
    /// </summary>
    /// <param name="productCategory">The product category DTO.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the created product category.
    /// </returns>
    Task<ProductCategory> CreateAsync(ProductCategoryRequest productCategory, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Updates an existing product category.
    /// </summary>
    /// <param name="productCategoryId">The ID of the product category to update.</param>
    /// <param name="productCategory">The product category DTO.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the updated product category if found; otherwise, null.
    /// </returns>
    Task<ProductCategory?> UpdateAsync(long productCategoryId, ProductCategoryRequest productCategory, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Deletes a product category by ID.
    /// </summary>
    /// <param name="productCategoryId">The ID of the product category to delete.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result is true if the product category was deleted; otherwise, false.
    /// </returns>
    Task<bool> DeleteAsync(long productCategoryId, CancellationToken cancellationToken = default!);
}
