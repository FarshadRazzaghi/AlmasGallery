export interface Resource {
  remove: string;
  recommended: string;

  routingResource: RoutingResource;
  productResource: ProductResource;
  dropDown: {
    selectItem: string;
  }
}

export interface RoutingResource {
  navigation: string;
  dashboards: string;
  APPS: string;
  products: string;
  productsAdd: string;
}

export interface ProductResource {
  productInformation: string;
  productImage: string;
  productPricing: string;
  productOrganization: string;
  productVariant: string;
  productInventory: string;
  name: string;
  description: string;
  image: string;
  stockKeepingUnit: string;
  barCode: string;
  basePrice: string;
  discount: string;
  chargeTax: string;
  inStock: string;
  vendor: string;
  category: string;
  collection: string;
  publishStatus: string;
  tags: string;
  options: string;
  variantValue: string;
  addNewVariant: string;
  addNewCategory: string;
  restock: string;
  shipping: string;
  globalDelivery: string;
  attributes: string;
  advanced: string;
  addToStocks: string;
  quantity: string;
  currentQuantity: string;
  deliveryQuantity: string;
  restockedLastTime: string;
  overallQuantity: string;
  shippingType: string;
  sellerFulfilled: string;
  sellerFulfilledDescription: string;
  companyFullfilled: string;
  companyFullfilledDescription: string;
  worldwideDelivery: string;
  worldwideDeliveryDescription: string;
  selectedCountries: string;
  localDelivery: string;
  localDeliveryDescription: string;
  isFragile: string;
  isBiodegradable: string;
  isFrozen: string;
  maxAllowedTemperature: string;
  expiryDate: string;
  identifierType: string;
  identifier: string;
  identifirePlaceHolder: string;
}
