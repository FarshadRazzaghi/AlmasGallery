using Catalog.Application.Models.Filters;

namespace Catalog.Application.Contract.UseCase;

public partial interface IProductCategoryUseCase : IBaseUseCase<ProductCategory>
{
    Task<(ProductCategory[] list, long totalCount)> GetListIncludingCustomFieldGroupsAsync(ProductCategoryFilter filter, CancellationToken cancellationToken = default!);
    Task<ProductCategory?> GetSingleIncludingCustomFieldGroupsAsync(long productCategoryId, CancellationToken cancellationToken = default!);
    Task<ProductCategory> CreateAsync(ProductCategoryDto productCategory, CancellationToken cancellationToken = default!);
    Task<ProductCategory?> UpdateAsync(long productCategoryId, ProductCategoryDto productCategory, CancellationToken cancellationToken = default!);
    Task<bool> DeleteAsync(long productCategoryId, CancellationToken cancellation = default!);
}
