export interface Resource {
  readonly add: string;
  readonly update: string;
  readonly remove: string;
  readonly submit: string;
  readonly back: string;
  readonly refresh: string;
  readonly cancel: string;
  readonly yes: string;
  readonly no: string;
  readonly validationResource: ValidationResource;
  readonly conditionResource: ConditionResource;
  readonly enumResource: EnumResource;
  readonly routingResource: RoutingResource;
  readonly customFieldGroupResource: CustomFieldGroupResource;
  readonly customFieldResource: CustomFieldResource;
  readonly productCategoryResource: ProductCategoryResource;
}

export interface ValidationResource {
  readonly regexErrorMessage: string;
  readonly matchRegexErrorMessage: string;
  readonly matchRegexErrorMessageWithParameters: string,
  readonly equalOrGreaterErrorMessage: string;
  readonly betweenErrorMessage: string;
  readonly betweenErrorMessageWithParameters: string;
};

export interface EnumResource {
  readonly customFieldGroupType: {
    readonly product: string;
  };
  readonly customFieldDataType:
  {
    readonly number: string;
    readonly string: string;
    readonly date: string;
    readonly boolean: string;
  };
  readonly customFieldGroupLocationType: {
    readonly pageSection: string;
    readonly pricingSection: string;
    readonly descriptionSection: string;
  };
}

export interface RoutingResource {
  readonly error: {
    readonly error: string;
    readonly forbidden: string;
    readonly notFound: string;
    readonly serverError: string;
  },
  readonly navigation: {
    readonly navigation: string;
    readonly dashboard: string;
  },
  readonly appManagement: {
    readonly appManagement: string;
    readonly customFieldGroups: string;
    readonly customFieldGroupList: string;
    readonly customFieldGroupAdd: string;
    readonly customFieldGroupEdit: string;
    readonly customFieldGroupEditWithParameter: string;
  }
  readonly productManagement: {
    readonly productManagement: string;
    readonly productCategories: string;
    readonly productCategoryList: string;
    readonly productCategoryAdd: string;
    readonly productCategoryEdit: string;
    readonly productCategoryEditWithParameter: string;
  }
}

export interface ConditionResource {
  readonly noCondition: string;
  readonly equals: string;
  readonly notEquals: string;
  readonly contains: string;
  readonly notContains: string;
  readonly lowerThan: string;
  readonly lowerThanEquals: string;
  readonly higherThan: string;
  readonly higherThanEquals: string;
}

export interface CustomFieldGroupResource {
  readonly baseInfo: string;
  readonly name: string;
  readonly entityType: string;
  readonly customFields: string;
  readonly noCustomFields: string;
  readonly deleteConfirmationMessage: string;
}

export interface CustomFieldResource {
  readonly name: string;
  readonly dataType: string;
  readonly initialValue: string;
  readonly helpText: string;
  readonly placeHolder: string;
  readonly regex: string;
  readonly isRequired: string;
  readonly isMultiLine: string;
  readonly applyCurrentDate: string;
  readonly isActive: string;
  readonly maxValue: string;
  readonly minValue: string;
  readonly parent: string;
  readonly parentCondition: string;
}

export interface ProductCategoryResource {
  readonly baseInfo: string;
  readonly name: string;
  readonly parent: string;
  readonly description: string;
  readonly isActive: string;
  readonly order: string;
  readonly customFieldGroups: string;
  readonly customFieldGroup: string;
  readonly addNewCustomFieldGroup: string;
  readonly customFieldGroupLocation: string;
  readonly deleteConfirmationMessage: string;
}
