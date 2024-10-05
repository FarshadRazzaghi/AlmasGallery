namespace Catalog.Application.Business.UseCase;

internal partial class ProductCategoryUseCase(IProductCategoryRepository productCategoryRepository) : BaseUseCase<ProductCategory>(productCategoryRepository), IProductCategoryUseCase
{
    public Task<ProductCategory> CreateAsync(AddProductDto product, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<ProductCategory?> UpdateAsync(long productId, AddProductDto product, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}