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
            //Id = product.Id,
            //DateStamp = product.DateStamp,

            //CreatedAt = product.CreatedAt,
            //CreatorId = product.CreatorId,
            //ModifiedAt = product.ModifiedAt,
            //ModifierId = product.ModifierId,

            //Status = product.Status,
            //ProductCategory = product.ProductCategory,

            PublishStatus = product.PublishStatus,
            AllowedTemperature = product.AllowedTemperature,
            BarCode = product.BarCode,
            ProductCategoryId = product.ProductCategoryId,
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

        return model;
    }
}