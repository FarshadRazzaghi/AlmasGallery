export interface Resource {
  remove: string;
  add: string;
  update: string;
  cancel: string;
  yes: string;
  no: string;
  recommended: string;
  backToPrevious: string;
  submit: string;

  routingResource: RoutingResource;
  productResource: ProductResource;
  customFieldResource: CustomFieldResource;
  enumResources: EnumResource;
  dropDown: {
    selectItem: string;
  }
}

export interface RoutingResource {
  navigation: string;
  dashboards: string;
  settings: string;
  customFields: string;
  customFieldsAdd: string;
  products: string;
  productsAdd: string;
  productsList: string;
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
  companyFulfilled: string;
  companyFulfilledDescription: string;
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
  identifierPlaceHolder: string;
}

export interface CustomFieldResource {
  groupName: string;
  groupType: string;
  name: string;
  dataType: string;
  initValue: string;
  helpText: string;
  placeHolder: string;
  regex: string;
  isRequired: string;
  isMultiLine: string;
  applyCurrentDate: string;
  isActive: string;
  maxValue: string;
  minValue: string;
  numberDataType: string;
  stringDataType: string;
  dateDataType: string;
  booleanDataType: string;
  minValueCustomErrorMessage: string;
  deleteConfirmationMessage: string;
  parent: string;
  parentCondition: string;
}

export interface EnumResource {
  CustomFieldGroupType: {
    Product: string;
  }
}
