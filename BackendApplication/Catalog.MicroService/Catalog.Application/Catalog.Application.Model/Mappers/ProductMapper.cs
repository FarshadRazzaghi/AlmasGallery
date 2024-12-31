using Catalog.Application.Models;
using Catalog.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Catalog.Application.Model.Mappers;

public static class ProductMapper
{
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