using Catalog.Application.Model.Mappers;

namespace Catalog.Application.Business.UseCase;

internal partial class ProductUseCase : IProductUseCase
{
    public async Task<Product> CreateAsync(ProductDto product, CancellationToken cancellationToken = default)
    {
        var model = product.ToModel();
        await Task.Run(() =>
        {
            Repository.Create(model);
            ArgumentNullException.ThrowIfNull(model);
        }, cancellationToken);

        return model;
    }

    public async Task<Product?> UpdateAsync(long productId, ProductDto product, CancellationToken cancellationToken)
    {
        var existedProduct = await GetByIdAsync(productId, cancellationToken);
        if (existedProduct == null)
        {
            return null;
        }

        var model = product.ToModel();
        await Task.Run(() =>
        {
            Repository.Update(model);
        }, cancellationToken);

        return model;
    }
}
