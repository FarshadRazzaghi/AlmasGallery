import * as models from "@core/models";

export class EnglishResource implements models.Resource {
  yes: string = 'Yes';
  no: string = 'No';
  add: string = 'Add';
  update: string = 'Update';
  cancel: string = 'Cancel';
  remove: string = 'Remove';
  submit: string = 'Submit';
  back: string = 'Back';
  refresh: string = 'Refresh';
  validationResource: models.ValidationResource = {
    regexErrorMessage: 'The value is not a valid regex pattern.',
    matchRegexErrorMessage: 'The value does not match the regex pattern.',
    matchRegexErrorMessageWithParameters: 'The value does not match the {0} pattern.',
    equalOrGreaterErrorMessage: 'The value must be less than the maximum allowed.',
    betweenErrorMessage: 'The value must be between the minimum and maximum allowed.',
    betweenErrorMessageWithParameters: 'The value must be between {0} and {1}.',
  };
  conditionResource: models.ConditionResource = {
    equals: 'Equals',
    notEquals: 'Not Equals',
    contains: 'Contains',
    notContains: 'Not Contains',
    higherThan: 'Higher',
    higherThanEquals: 'Higher Equals',
    lowerThan: 'Lower',
    lowerThanEquals: 'Lower Equals',
    noCondition: 'No Condition'
  };
  enumResource: models.EnumResource = {
    customFieldGroupType: {
      product: 'Product',
    },
    customFieldDataType: {
      number: 'Number',
      string: 'String',
      date: 'Date',
      boolean: 'Yes/No',
    },
    customFieldGroupLocationType: {
      pageSection: 'Product Page',
      pricingSection: 'Pricing Section',
      descriptionSection: 'Description Section',
    },
  };
  routingResource: models.RoutingResource = {
    error: {
      error: 'Error',
      forbidden: 'Access Denied',
      notFound: 'Page Not Found',
      serverError: 'Server Error',
    },
    navigation: {
      navigation: 'Navigation',
      dashboard: 'Dashboards',
    },
    appManagement: {
      appManagement: 'Settings',
      customFieldGroups: 'Custom Field',
      customFieldGroupList: 'List Custom Fields',
      customFieldGroupAdd: 'Add Custom Field',
      customFieldGroupEdit: 'Edit Custom Field',
      customFieldGroupEditWithParameter: 'Edit "{0}" Custom Field',
    },
    productManagement: {
      productManagement: 'Product Management',
      productCategories: 'Product Category',
      productCategoryList: 'List Product Categories',
      productCategoryAdd: 'Add Product Category',
      productCategoryEdit: 'Edit Product Category',
      productCategoryEditWithParameter: 'Edit "{0}" Product Category'
    }
  };
  customFieldGroupResource: models.CustomFieldGroupResource = {
    baseInfo: 'Base info',
    name: 'Name',
    entityType: 'Group Type',
    customFields: 'Custom Fileds',
    noCustomFields: 'No Custom Filed Added',
    deleteConfirmationMessage: 'Are you sure, about delete the Custom field group?',
  };
  customFieldResource: models.CustomFieldResource = {
    name: 'Name',
    dataType: 'Data Type',
    helpText: 'Help Text',
    placeHolder: 'Place Holder',
    regex: 'Regex',
    initialValue: 'Init Value',
    isRequired: 'Required',
    isMultiLine: 'Multiline',
    applyCurrentDate: 'Current Date',
    isActive: 'Active',
    maxValue: 'Min value',
    minValue: 'Max Value',
    parent: 'Parent',
    parentCondition: 'Parent Condition',
  };
  productCategoryResource: models.ProductCategoryResource = {
    baseInfo: 'Base info',
    name: 'Name',
    parent: 'Parent',
    description: 'Description',
    isActive: 'Active',
    order: 'Order',
    customFieldGroup: 'Custom Field Group',
    customFieldGroups: 'Custom Field Groups',
    addNewCustomFieldGroup: 'Add new Custom Field Group',
    customFieldGroupLocation: 'Custom Field Group Location',
    deleteConfirmationMessage: 'Are you sure, about delete the Product category?',
  }
}
