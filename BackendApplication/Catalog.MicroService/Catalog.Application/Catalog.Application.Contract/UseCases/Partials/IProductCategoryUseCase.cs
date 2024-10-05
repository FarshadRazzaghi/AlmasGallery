namespace Catalog.Application.Contract.UseCase;

public partial interface IProductCategoryUseCase : IBaseUseCase<ProductCategory>
{
    Task<ProductCategory> CreateAsync(ProductDto product, CancellationToken cancellationToken = default!);
    Task<ProductCategory?> UpdateAsync(long productId, ProductDto product, CancellationToken cancellationToken);
}
