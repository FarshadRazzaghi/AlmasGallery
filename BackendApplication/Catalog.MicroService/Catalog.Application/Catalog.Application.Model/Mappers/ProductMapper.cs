using Catalog.Application.Models;
using Catalog.Domain.Models;

namespace Catalog.Application.Model.Mappers;

/// <summary>  
/// Provides extension methods for mapping between ProductDto and Product entities.  
/// </summary>
public static class ProductMapper
{
    /// <summary>  
    /// Maps a ProductDto to a Product entity.  
    /// </summary>  
    /// <param name="product">The ProductDto to map.</param>  
    /// <returns>The mapped Product entity.</returns>  
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