using AlmasGallery.Catalog.Domain.Models;

namespace AlmasGallery.Catalog.Application.Models.Mappers;

/// <summary>
/// Provides extension methods for mapping between product-related DTOs and domain models.
/// </summary>
public static class ProductMapper
{
    /// <summary>
    /// Maps a <see cref="ProductDto"/> to a <see cref="Product"/> domain model.
    /// </summary>
    /// <param name="product">The product DTO to map from.</param>
    /// <returns>A <see cref="Product"/> domain model with properties mapped from the DTO.</returns>
    public static Product ToModel(this ProductDto product)
    {
        var model = new Product()
        {
            Name = product.Name,
            Description = product.Description,
            PublishStatus = product.PublishStatus,
            Sku = product.SKU,
            Tags = product.Tags,
            BarCode = product.BarCode,
            ProductCategoryId = product.ProductCategoryId,
            CollectionId = product.CollectionId,
            VendorId = product.VendorId,
        };

        return model;
    }
}