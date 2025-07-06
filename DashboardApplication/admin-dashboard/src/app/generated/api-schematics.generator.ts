/**
 * @fileoverview
 * ⚠️ WARNING: This file is auto-generated. ⚠️
 *
 * Any manual changes to this file will be overwritten when the code is regenerated.
 * If you need to modify the API functionality, please:
 * 1. Modify the API generator templates
 * 2. Re-run the code generation process
 *
 * Last generated: 2025-05-16T11:05:39.035Z
 * Generator version: 1.0.0
 *
 * @generated
 */



/**
 * Represents the data type of a custom field.
 *
 * Values:
 * `1` - Number
 * `2` - String
 * `3` - Date
 * `4` - Boolean
 *
 * @type {1 | 2 | 3 | 4}
 */
export type CustomFieldDataType = 1 | 2 | 3 | 4;


/**
 * Represents the entity type of a custom field group.
 *
 * Values:
 * `1` - Product
 *
 * @type {1}
 */
export type CustomFieldGroupEntityType = 1;


/**
 * Represents the location type of a custom field group.
 *
 * Values:
 * `1` - PageSection
 * `2` - PricingSection
 * `3` - DescriptionSection
 *
 * @type {1 | 2 | 3}
 */
export type CustomFieldGroupLocationType = 1 | 2 | 3;


/**
 * Represents a custom field group data transfer object.
 *
 * @interface CustomFieldGroupRequest
 * @property {string} [name] - Gets or sets the name of the custom field group.
            This property is required and cannot be null or empty.
 * @property {CustomFieldGroupEntityType} [entityType] - Represents the entity type of a custom field group.
 * @property {Array<CustomFieldRequest>} [customFields] - Represents a custom field data transfer object.
 */
export interface CustomFieldGroupRequest {
    name: string;
    entityType: CustomFieldGroupEntityType;
    customFields: CustomFieldRequest[]
}


/**
 * Represents a response object for a custom field group.
 *
 * @interface CustomFieldGroupResponse
 * @property {number} [id] - Gets or sets the ID of the custom field group.
 * @property {string} [name] - Gets or sets the name of the custom field group.
 * @property {CustomFieldGroupEntityType} [entityType] - Represents the entity type of a custom field group.
 * @property {Array<CustomFieldResponse>} [customFields] - Represents a response object for a custom field.
 */
export interface CustomFieldGroupResponse {
    id: number;
    name: string;
    entityType: CustomFieldGroupEntityType;
    customFields: CustomFieldResponse[]
}


/**
 * Represents a custom field data transfer object.
 *
 * @interface CustomFieldRequest
 * @property {number} [id] - Gets or sets the ID of the custom field.
            This property is required and cannot be null or empty.
 * @property {string} [uniqueId] - Gets or sets the unique identifier of the custom field.
            This property is required and cannot be null or empty.
 * @property {string} [name] - Gets or sets the name of the custom field.
            This property is required and cannot be null or empty.
 * @property {CustomFieldDataType} [dataType] - Represents the data type of a custom field.
 * @property {boolean} [hasParentCondition] - Gets or sets a value indicating whether the custom field has a parent condition.
 * @property {boolean} [isActive] - Gets or sets a value indicating whether the custom field is active.
 * @property {boolean} [isRequired] - Gets or sets a value indicating whether the custom field is required.
 * @property {string} [helpText] - Gets or sets the help text for the custom field.
 * @property {string} [placeHolder] - Gets or sets the placeholder text for the custom field.
 * @property {string} [initialValue] - Gets or sets the initial value of the custom field.
 * @property {string} [validation] - Gets or sets the validation rules for the custom field.
 * @property {string} [parentUniqueId] - Gets or sets the unique identifier of the parent custom field.
 * @property {string} [parentCondition] - Gets or sets the parent condition for the custom field.
 */
export interface CustomFieldRequest {
    id: number;
    uniqueId: string;
    name: string;
    dataType: CustomFieldDataType;
    hasParentCondition?: boolean;
    isActive: boolean;
    isRequired: boolean;
    helpText?: string;
    placeHolder?: string;
    initialValue?: string;
    validation?: string;
    parentUniqueId?: string;
    parentCondition?: string
}


/**
 * Represents a response object for a custom field.
 *
 * @interface CustomFieldResponse
 * @property {number} [id] - Gets or sets the ID of the custom field.
 * @property {string} [name] - Gets or sets the name of the custom field.
 * @property {CustomFieldDataType} [dataType] - Represents the data type of a custom field.
 * @property {boolean} [hasParentCondition] - Gets or sets a value indicating whether the custom field has a parent condition.
 * @property {boolean} [isActive] - Gets or sets a value indicating whether the custom field is active.
 * @property {boolean} [isRequired] - Gets or sets a value indicating whether the custom field is required.
 * @property {string} [helpText] - Gets or sets the help text for the custom field.
 * @property {string} [placeHolder] - Gets or sets the placeholder text for the custom field.
 * @property {string} [initialValue] - Gets or sets the initial value of the custom field.
 * @property {string} [validation] - Gets or sets the validation rules for the custom field.
 * @property {number} [parentId] - Gets or sets the ID of the parent custom field.
 * @property {string} [parentCondition] - Gets or sets the parent condition for the custom field.
 */
export interface CustomFieldResponse {
    id: number;
    name: string;
    dataType: CustomFieldDataType;
    hasParentCondition?: boolean;
    isActive: boolean;
    isRequired: boolean;
    helpText?: string;
    placeHolder?: string;
    initialValue?: string;
    validation?: string;
    parentId?: number;
    parentCondition?: string
}


/**
 * Represents a response object for a dropdown item.
 *
 * @interface DropdownResponse
 * @property {number} [key] - Gets or sets the key of the dropdown item.
 * @property {string} [value] - Gets or sets the value of the dropdown item.
 */
export interface DropdownResponse {
    key: number;
    value: string
}


/**
 * A machine-readable format for specifying errors in HTTP API responses based on https://tools.ietf.org/html/rfc7807.
 *
 * @interface ProblemDetails
 * @property {string} [type] - A URI reference [RFC3986] that identifies the problem type. This specification
  encourages that, when dereferenced, it provide human-readable documentation for
 the problem type (e.g., using HTML [W3C.REC-html5-20141028]). When this member
  is not present, its value is assumed to be "about:blank".
 * @property {string} [title] - A short, human-readable summary of the problem type. It SHOULD NOT change from occurrence to occurrence
 of the problem, except for purposes of localization(e.g., using proactive content negotiation;
  see[RFC7231], Section 3.4).
 * @property {number} [status] - The HTTP status code([RFC7231], Section 6) generated by the origin server for this occurrence of the problem.
 * @property {string} [detail] - A human-readable explanation specific to this occurrence of the problem.
 * @property {string} [instance] - A URI reference that identifies the specific occurrence of the problem. It may or may not yield further information if dereferenced.
 */
export interface ProblemDetails {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string
}


/**
 * Represents a product category custom field group data transfer object.
 *
 * @interface ProductCategoryCustomFieldGroupRequest
 * @property {number} [id] - Gets or sets the ID of the product category custom field group.
 * @property {boolean} [isActive] - Gets or sets a value indicating whether the custom field group is active.
 * @property {number} [customFieldGroupId] - Gets or sets the ID of the custom field group.
 * @property {CustomFieldGroupLocationType} [customFieldGroupLocation] - Represents the location type of a custom field group.
 */
export interface ProductCategoryCustomFieldGroupRequest {
    id: number;
    isActive: boolean;
    customFieldGroupId: number;
    customFieldGroupLocation: CustomFieldGroupLocationType
}


/**
 * Represents a response object for a product category custom field group.
 *
 * @interface ProductCategoryCustomFieldGroupResponse
 * @property {CustomFieldGroupLocationType} [location] - Represents the location type of a custom field group.
 * @property {boolean} [isActive] - Gets or sets a value indicating whether the custom field group is active.
 * @property {number} [id] - Gets or sets the ID of the custom field group.
 * @property {string} [name] - Gets or sets the name of the custom field group.
 * @property {CustomFieldGroupEntityType} [entityType] - Represents the entity type of a custom field group.
 * @property {Array<CustomFieldResponse>} [customFields] - Represents a response object for a custom field.
 */
export interface ProductCategoryCustomFieldGroupResponse {
    location: CustomFieldGroupLocationType;
    isActive: boolean;
    id: number;
    name: string;
    entityType: CustomFieldGroupEntityType;
    customFields: CustomFieldResponse[]
}


/**
 * Represents a product category data transfer object.
 *
 * @interface ProductCategoryRequest
 * @property {string} [name] - Gets or sets the name of the product category.
            This property is required and cannot be null or empty.
 * @property {string} [description] - Gets or sets the description of the product category.
 * @property {number} [parentId] - Gets or sets the ID of the parent product category.
 * @property {Array<ProductCategoryCustomFieldGroupRequest>} [customFieldGroups] - Represents a product category custom field group data transfer object.
 */
export interface ProductCategoryRequest {
    name: string;
    description: string;
    parentId?: number;
    customFieldGroups: ProductCategoryCustomFieldGroupRequest[]
}


/**
 * Represents a response object for a product category.
 *
 * @interface ProductCategoryResponse
 * @property {number} [id] - Gets or sets the ID of the product category.
 * @property {string} [name] - Gets or sets the name of the product category.
 * @property {string} [description] - Gets or sets the description of the product category.
 * @property {number} [parentId] - Gets or sets the ID of the parent product category.
 * @property {Array<ProductCategoryCustomFieldGroupResponse>} [customFieldGroups] - Represents a response object for a product category custom field group.
 */
export interface ProductCategoryResponse {
    id: number;
    name: string;
    description?: string;
    parentId?: number;
    customFieldGroups: ProductCategoryCustomFieldGroupResponse[]
}

