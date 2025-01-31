import { CustomFieldResource, EnumResource, ProductResource, Resource, RoutingResource, ProductCategoryResource } from "./resource";

export class EnglishResource implements Resource {
  remove = 'Remove';
  add = ' Add';
  edit = 'Edit';
  update = 'Update';
  cancel = 'Cancel';
  recommended = 'Recommended';
  backToPrevious = 'Back';
  submit = 'Submit';
  yes = 'Yes';
  no = 'No';
  refresh = 'Refresh';

  dropDown = {
    selectItem: 'Please Select an Item',
  };

  routingResource: RoutingResource = {
    navigation: 'Navigation',
    dashboards: 'Dashboards',
    settings: 'Settings',
    customFields: 'Custom Fields',
    customFieldsAdd: 'Add New Custom Field',
    products: 'Products',
    productsList: 'Products List',
    productsAdd: 'Add New Product',
    productCategories: 'Product Categories',
    productCategoriesAdd: 'Add New Product Category',
    productCategoriesList: 'Product Categories List',
  };
  productResource: ProductResource = {
    productInformation: 'Product Information',
    productImage: 'Product Image',
    productPricing: 'Pricing',
    productOrganization: 'Organize',
    productVariant: 'Variant',
    productInventory: 'Inventory',
    name: 'Name',
    description: 'Description',
    stockKeepingUnit: 'SKU',
    barCode: 'Barcode',
    basePrice: 'Base Price',
    discount: 'Discount',
    chargeTax: 'Charge Tax on This product',
    inStock: 'Product In Stock',
    vendor: 'Vendor',
    category: 'Category',
    collection: 'Collection',
    publishStatus: 'Status',
    tags: 'Tags',
    options: 'Options',
    variantValue: 'Value',
    addNewVariant: 'Add New Variant',
    addNewCategory: 'Add New Category',
    restock: 'Restock',
    shipping: 'Shipping',
    globalDelivery: 'Global Delivery',
    attributes: 'Attributes',
    advanced: 'Advanced',
    addToStocks: 'Add To Stocks',
    quantity: "Quantity",
    currentQuantity: 'Product in stock now',
    deliveryQuantity: 'Product in transit',
    restockedLastTime: 'Last time restocked',
    overallQuantity: 'Total stock over lifetime',
    shippingType: 'Shipping Type',
    sellerFulfilled: 'Fulfilled by seller',
    sellerFulfilledDescription: `You'll be responsible for product delivery. Any damage or delay during shipping may cost you a Damage fee.`,
    companyFulfilled: 'Fulfilled by Almas Gallery',
    companyFulfilledDescription: 'Your product, Our responsibility. For a measly fee, we will handle the delivery process for you.',
    worldwideDelivery: 'Worldwide Delivery',
    worldwideDeliveryDescription: "Only available with Shipping method: Fulfilled by Almas Gallery",
    selectedCountries: "Selected Countries",
    localDelivery: "Local Delivery",
    localDeliveryDescription: "Deliver to your country of residence : Change profile address",
    isFragile: 'Fragile Product',
    isBiodegradable: 'Biodegradable Product',
    isFrozen: 'Frozen Product',
    maxAllowedTemperature: 'Max Allowed Temperature',
    expiryDate: 'Expiry Date Of Product',
    identifierType: 'Product ID Type',
    identifier: 'Product ID',
    identifierPlaceHolder: '{0} Number',
  };
  productCategoryResource: ProductCategoryResource = {
    name: 'Name',
    parent: 'Parent',
    noParent: 'No Parent Selected',
    customFieldGroup: 'Custom Field Group',
    customFieldLocation: 'Custom Field Location',
    isActive: 'Active',
    addNewCustomField: 'Add new group',
    description: 'Description',
    deleteConfirmationMessage: "Are you sure, about delete the Product Category?",
  };
  customFieldResource: CustomFieldResource = {
    groupName: 'Group Name',
    groupType: 'Group Type',
    name: 'Name',
    dataType: 'Data Type',
    helpText: 'Help Text',
    placeHolder: 'Place Holder',
    regex: 'Regex',
    initValue: 'Init Value',
    isRequired: 'Required',
    isMultiLine: 'Multiline',
    applyCurrentDate: 'Current Date',
    isActive: 'Active',
    maxValue: 'Min value',
    minValue: 'Max Value',
    minValueCustomErrorMessage: "Can not be Equal or greater than Max Value.",
    deleteConfirmationMessage: "Are you sure, about delete the CustomField?",
    parent: "Parent",
    parentCondition: "Parent Condition",
    noOptions: "No Option Added",
  };
  enumResources: EnumResource = {
    customFieldGroupType: {
      product: 'Product',
    },
    customFieldGroupLocationType: {
      pageSection: "Product Page",
      pricingSection: "Pricing Section",
      descriptionSection: "Description Section",
    },
    customFieldDataType: {
      number: 'Number',
      string: 'String',
      date: 'Date',
      boolean: 'Yes/No',
    }
  };
}
