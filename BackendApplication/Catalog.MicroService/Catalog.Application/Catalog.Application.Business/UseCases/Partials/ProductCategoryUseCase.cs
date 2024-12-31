namespace Catalog.Application.Business.UseCase;

internal partial class ProductCategoryUseCase : IProductCategoryUseCase
{
    public Task<ProductCategory> CreateAsync(ProductDto product, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<ProductCategory?> UpdateAsync(long productId, ProductDto product, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}