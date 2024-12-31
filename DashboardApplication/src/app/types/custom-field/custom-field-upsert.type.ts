import { CustomFieldOptionRequest, CustomFieldRequest } from "./custom-field-request.type";

export type CustomFieldUpsertOption = {
  id?: number;
  uuid: string;
  dataType: number;
  dataTypeName: string;
  name: string;
  isActive: boolean;
  isRequired: boolean;
  helpText?: string;
  placeHolder?: string;
  initialValue?: string | Date | number | boolean;

  parentId?: number | null;
  customFieldParent?: string | null;
  parentCondition?: string | Date | number | boolean;

  applyCurrentDate?: boolean;
  isMultiLine?: boolean,
  numberMinValue?: number,
  numberMaxValue?: number,
  regex?: string,
  validation?: string;
}

export type CustomFieldUpsert = {
  id?: number;
  groupName?: string;
  groupType?: number;
  options?: CustomFieldUpsertOption[];
}

export type CustomFieldUpsertGroup = Pick<CustomFieldUpsert, "groupType" | "groupName">;

export type CustomFieldOptionValidation = {
  numberMinValue?: number,
  numberMaxValue?: number,
  isMultiLine?: boolean,
  regex?: string,
  applyCurrentDate?: boolean,
}

export const convertToRequest = (model: CustomFieldUpsert): CustomFieldRequest => {
  if (!model.groupName) {
    throw Error("Group Name Is Required");
  }

  return {
    name: model.groupName,
    entityType: model.groupType || 0,
    customFields: (model.options || []).map(x => {
      return {
        id: x.id,
        name: x.name,
        uniqueId: x.uuid,
        isActive: x.isActive,
        dataType: x.dataType,
        helpText: x.helpText,
        placeHolder: x.placeHolder,
        initialValue: x.initialValue?.toString(),
        isRequired: x.isRequired,
        parentUniqueId: x.customFieldParent,
        parentCondition: x.parentCondition,
        validation: x.validation,
      } as CustomFieldOptionRequest
    }),
  }
}
