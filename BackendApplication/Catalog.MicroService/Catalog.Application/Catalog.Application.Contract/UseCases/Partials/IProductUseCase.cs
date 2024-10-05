namespace Catalog.Application.Contract.UseCase;

public partial interface IProductUseCase : IBaseUseCase<Product>
{
    Task<Product> CreateAsync(ProductDto product, CancellationToken cancellationToken = default!);
    Task<Product?> UpdateAsync(long productId, ProductDto product, CancellationToken cancellationToken);
}
