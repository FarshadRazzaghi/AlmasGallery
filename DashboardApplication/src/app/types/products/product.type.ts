import { ProductRequest } from "./http/product-request.type";

export type ProductImage = {
  image?: string
}

export type ProductInformation = {
  name: string;
  sku?: number;
  barCode?: string;
  description: string;
}

export type ProductOrganize = {
  vendorId: number;
  categoryId: number;
  collectionId?: number;
  tags: string[];
}

export type ProductPricing = {
  basePrice: number;
  discountPrice: number;
  hasChargeTax: boolean;
  isInStock: boolean;
}

export type ProductVariant = {
  option: number;
  value: string;
}

export type ProductAdvanced = {
  identifierType: number;
  identifier: string;
}

export type ProductAttribute = {
  isFragile: boolean;
  isBiodegradable: boolean;
  isFrozen: boolean;
  hasExpiryDate: boolean;
  allowedTemperature?: number;
  expiryDate?: Date;
}

export type ProductGlobalDelivery = {
  globalDeliveryType: number;
  globalDeliveryCountries?: string[]
}

export type ProductShipping = {
  shippingType: number
}

export type ProductRestock = {
  quantity: number;
}

export type AddProduct = {
  id?: number;
  hasChargeTax?: boolean;
  isInStock?: boolean;
  isFragile?: boolean;
  isBiodegradable?: boolean;
  isFrozen?: boolean;
  hasExpiryDate?: boolean;
  name?: string;
  barCode?: string;
  sku?: number;
  description?: string;
  identifier?: string;
  image?: string;
  basePrice?: number;
  discountPrice?: number;
  vendorId?: number;
  categoryId?: number;
  collectionId?: number;
  identifierType?: number;
  quantity?: number;
  shippingType?: number;
  globalDeliveryType?: number;
  allowedTemperature?: number;
  expiryDate?: Date;
  tags?: string[];
  globalDeliveryCountries?: string[];
  variants?: ProductVariant[];
}

export const convertToRequest = (model: AddProduct): ProductRequest => {
  return {
    hasChargeTax: model.hasChargeTax,
    isInStock: model.isInStock,
    isFragile: model.isFragile,
    isBiodegradable: model.isBiodegradable,
    isFrozen: model.isFrozen,
    hasExpiryDate: model.hasExpiryDate,
    name: model.name,
    barCode: model.barCode,
    sku: model.sku ? model.sku.toString() : '',
    description: model.description,
    identifier: model.identifier,
    image: model.image,
    basePrice: model.basePrice,
    discountPrice: model.discountPrice,
    vendorId: model.vendorId,
    categoryId: model.categoryId,
    collectionId: model.collectionId,
    identifierType: model.identifierType,
    quantity: model.quantity,
    shippingType: model.shippingType,
    globalDeliveryType: model.globalDeliveryType,
    allowedTemperature: model.allowedTemperature,
    expiryDate: model.expiryDate,
    tags: model.tags ? JSON.stringify(model.tags) : '',
    variants: model.variants ? JSON.stringify(model.variants) : '',
    globalDeliveryCountries: model.globalDeliveryCountries,
  }
}

export const convertToModel = (model: ProductRequest): AddProduct => {
  return {
    id: model.id,
    hasChargeTax: model.hasChargeTax,
    isInStock: model.isInStock,
    isFragile: model.isFragile,
    isBiodegradable: model.isBiodegradable,
    isFrozen: model.isFrozen,
    hasExpiryDate: model.hasExpiryDate,
    name: model.name,
    barCode: model.barCode,
    sku: model.sku ? +model.sku : undefined,
    description: model.description,
    identifier: model.identifier,
    image: model.image,
    basePrice: model.basePrice,
    discountPrice: model.discountPrice,
    vendorId: model.vendorId,
    categoryId: model.categoryId,
    collectionId: model.collectionId,
    identifierType: model.identifierType,
    quantity: model.quantity,
    shippingType: model.shippingType,
    globalDeliveryType: model.globalDeliveryType,
    allowedTemperature: model.allowedTemperature,
    expiryDate: model.expiryDate,
    tags: model.tags ? JSON.parse(model.tags) : [],
    variants: model.variants ? JSON.parse(model.variants) : [],
    globalDeliveryCountries: model.globalDeliveryCountries,
  }
}
