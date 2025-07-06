using Catalog.Application.Models.Mappers;

namespace Catalog.Application.Business.UseCase;

internal partial class ProductUseCase : IProductUseCase
{
    public async Task<Product> CreateAsync(ProductDto product, CancellationToken cancellationToken = default)
    {
        var model = product.ToModel();
        await Task.Run(() =>
        {
            model.CreatedAt = DateTime.UtcNow;
            Repository.Add(model);
            ArgumentNullException.ThrowIfNull(model);
        }, cancellationToken);

        return model;
    }

    public async Task<Product?> UpdateAsync(long productId, ProductDto product, CancellationToken cancellationToken = default)
    {
        var existedProduct = await GetByIdAsync(productId, cancellationToken);
        if (existedProduct == null)
        {
            return null;
        }

        var model = product.ToModel();
        await Task.Run(() =>
        {
            model.ModifiedAt = DateTime.UtcNow;
            Repository.Modify(model);
        }, cancellationToken);

        return model;
    }
}
