import { ProductUpsertRequest } from "./http/product-request.type";

export type ProductUpsertVariant = {
  option: number;
  value: string;
}
export type ProductUpsert = {
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
  variants?: ProductUpsertVariant[];
}

export type ProductUpsertImage = Pick<ProductUpsert, "image">;
export type ProductUpsertInformation = Pick<ProductUpsert, "name" | "sku" | "barCode" | "description">;
export type ProductUpsertOrganize = Pick<ProductUpsert, "vendorId" | "categoryId" | "collectionId" | "tags">;
export type ProductUpsertPricing = Pick<ProductUpsert, "basePrice" | "discountPrice" | "hasChargeTax" | "isInStock">;
export type ProductUpsertAdvanced = Pick<ProductUpsert, "identifierType" | "identifier">;
export type ProductUpsertAttribute = Pick<ProductUpsert, "isFragile" | "isBiodegradable" | "isFrozen" | "hasExpiryDate" | "allowedTemperature" | "expiryDate">;
export type ProductUpsertGlobalDelivery = Pick<ProductUpsert, "globalDeliveryType" | "globalDeliveryCountries">;
export type ProductUpsertShipping = Pick<ProductUpsert, "shippingType">;
export type ProductUpsertRestock = Pick<ProductUpsert, "quantity">;

export const convertToRequest = (model: ProductUpsert): ProductUpsertRequest => {
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

export const convertToModel = (request: ProductUpsertRequest): ProductUpsert => {
  return {
    id: request.id,
    hasChargeTax: request.hasChargeTax,
    isInStock: request.isInStock,
    isFragile: request.isFragile,
    isBiodegradable: request.isBiodegradable,
    isFrozen: request.isFrozen,
    hasExpiryDate: request.hasExpiryDate,
    name: request.name,
    barCode: request.barCode,
    sku: request.sku ? +request.sku : undefined,
    description: request.description,
    identifier: request.identifier,
    image: request.image,
    basePrice: request.basePrice,
    discountPrice: request.discountPrice,
    vendorId: request.vendorId,
    categoryId: request.categoryId,
    collectionId: request.collectionId,
    identifierType: request.identifierType,
    quantity: request.quantity,
    shippingType: request.shippingType,
    globalDeliveryType: request.globalDeliveryType,
    allowedTemperature: request.allowedTemperature,
    expiryDate: request.expiryDate,
    tags: request.tags ? JSON.parse(request.tags) : [],
    variants: request.variants ? JSON.parse(request.variants) : [],
    globalDeliveryCountries: request.globalDeliveryCountries,
  }
}
