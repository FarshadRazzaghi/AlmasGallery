namespace Catalog.Application.Business.UseCase;

internal partial class ProductUseCase(IProductRepository productRepository) : BaseUseCase<Product>(productRepository), IProductUseCase
{
    public async Task<Product> CreateAsync(AddProductDto product, CancellationToken cancellationToken = default)
    {
        var model = new Product()
        {
            AllowedTemperature = product.AllowedTemperature,
            BarCode = product.BarCode,
            CategoryId = product.CategoryId,
            CollectionId = product.CollectionId,
            Description = product.Description,
            DiscountPrice = product.DiscountPrice,
            ExpiryDate = product.ExpiryDate,
            GlobalDeliveryCountries = product.GlobalDeliveryCountries,
            GlobalDeliveryType = product.GlobalDeliveryType,
            HasChargeTax = product.HasChargeTax,
            HasExpiryDate = product.HasExpiryDate,
            Identifier = product.Identifier,
            IdentifierType = product.IdentifierType,
            Image = product.Image,
            IsBiodegradable = product.IsBiodegradable,
            IsFragile = product.IsFragile,
            IsFrozen = product.IsFrozen,
            IsInStock = product.IsInStock,
            Name = product.Name,
            BasePrice = product.BasePrice,
            Quantity = product.Quantity,
            ShippingType = product.ShippingType,
            Sku = product.SKU,
            Tags = product.Tags,
            Variants = product.Variants,
            VendorId = product.VendorId,
        };

        await Task.Run(() =>
        {
            Repository.Create(model);
            ArgumentNullException.ThrowIfNull(model);
        }, cancellationToken);

        return model;
    }

    public async Task<Product?> UpdateAsync(long productId, AddProductDto product, CancellationToken cancellationToken)
    {
        var existedProduct = await GetByIdAsync(productId, cancellationToken);
        if (existedProduct == null)
        {
            return null;
        }

        var model = new Product()
        {
            Id = existedProduct.Id,
            CreatedAt = existedProduct.CreatedAt,

            AllowedTemperature = product.AllowedTemperature,
            BarCode = product.BarCode,
            CategoryId = product.CategoryId,
            CollectionId = product.CollectionId,
            Description = product.Description,
            DiscountPrice = product.DiscountPrice,
            ExpiryDate = product.ExpiryDate,
            GlobalDeliveryCountries = product.GlobalDeliveryCountries,
            GlobalDeliveryType = product.GlobalDeliveryType,
            HasChargeTax = product.HasChargeTax,
            HasExpiryDate = product.HasExpiryDate,
            Identifier = product.Identifier,
            IdentifierType = product.IdentifierType,
            Image = product.Image,
            IsBiodegradable = product.IsBiodegradable,
            IsFragile = product.IsFragile,
            IsFrozen = product.IsFrozen,
            IsInStock = product.IsInStock,
            Name = product.Name,
            BasePrice = product.BasePrice,
            Quantity = product.Quantity,
            ShippingType = product.ShippingType,
            Sku = product.SKU,
            Tags = product.Tags,
            Variants = product.Variants,
            VendorId = product.VendorId,
        };

        await Task.Run(() =>
        {
            Repository.Update(model);
        }, cancellationToken);

        return model;
    }
}
