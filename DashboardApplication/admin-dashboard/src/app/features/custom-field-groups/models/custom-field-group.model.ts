import { CustomFieldDataType, CustomFieldGroupResponse } from '@core/generated';

export const CustomFieldDataTypeEnum = {
  Number: 1,
  String: 2,
  Date: 3,
  Boolean: 4
} as const;

export interface ExtendedCustomFieldGroupResponse extends CustomFieldGroupResponse {
  stringCustomFields: string;
}

export interface CustomFieldGroupCustomFieldForm {
  id: number;
  dataType: CustomFieldDataType;
  helpText?: string;
  uniqueId: string;
  initialValue?: string;
  isActive: boolean;
  isRequired: boolean;
  name: string;
  parentCondition?: string;
  parentId?: number;
  placeHolder?: string;
  validation?: string;
}

export interface ExtendedCustomFieldGroupCustomFieldForm extends CustomFieldGroupCustomFieldForm {
  initialValueNumber?: number;
  initialValueString?: string;
  initialValueDate?: Date;
  initialValueBoolean?: number;
  applyCurrentDate?: boolean;
  numberMinValue?: number;
  numberMaxValue?: number;
  isMultiLine?: boolean;
  regex?: string;
  parentUniqueId?: string;
  parentValueNumber?: number;
  parentValueString?: string;
  parentValueDate?: Date;
  parentValueBoolean?: number;
  parentConditionOperand?: number;
}

export interface CustomFieldGroupBase { }

export interface CustomFieldGroupBaseInfo extends CustomFieldGroupBase {
  id: number;
  name?: string;
  entityType?: number;
}

export interface CustomFieldGroupCustomField extends CustomFieldGroupBase {
  customFields: CustomFieldGroupCustomFieldForm[];
}

export interface CustomFieldGroupCustomFieldValidation {
  applyCurrentDate?: boolean;
  numberMinValue?: number;
  numberMaxValue?: number;
  isMultiLine?: boolean;
  regex?: string;
}

export interface CustomFieldGroupCustomFieldParentCondition {
  value?: string;
  condition?: number;
}
