namespace Catalog.Application.Contract.UseCase;

public partial interface IProductUseCase : IBaseUseCase<Product>
{
    Task<Product> CreateAsync(AddProductDto product, CancellationToken cancellationToken = default!);
    Task<Product?> UpdateAsync(long productId, AddProductDto product, CancellationToken cancellationToken);
}
