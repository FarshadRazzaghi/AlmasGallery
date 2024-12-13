import { CustomFieldOptionRequest, CustomFieldRequest } from "./http/custom-field-request.type";

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
    customFields: convertOptions(model.options || []),
  }
}

const convertOptions = (options: CustomFieldUpsertOption[]): CustomFieldOptionRequest[] => {
  const parent: CustomFieldUpsertOption[] = options.filter(x => !x.customFieldParent);

  return parent.map((x: CustomFieldUpsertOption) => {
    const children: CustomFieldOptionRequest[] = options.filter(y => y.customFieldParent == x.uuid).map(x => convertOptionsToRequest(x, []));
    return convertOptionsToRequest(x, children);
  });
}

const convertOptionsToRequest = (parent: CustomFieldUpsertOption, children: CustomFieldOptionRequest[]): CustomFieldOptionRequest => {
  const validation: CustomFieldOptionValidation = {
    isMultiLine: parent.isMultiLine,
    applyCurrentDate: parent.applyCurrentDate,
    numberMaxValue: parent.numberMaxValue,
    numberMinValue: parent.numberMinValue,
    regex: parent.regex,
  };

  return {
    id: parent.id,
    isActive: parent.isActive,
    name: parent.name,
    dataType: parent.dataType,
    helpText: parent.helpText,
    placeHolder: parent.placeHolder,
    initialValue: parent.initialValue?.toString(),
    isRequired: parent.isRequired,
    children: children,
    validation: JSON.stringify(validation),
  } as CustomFieldOptionRequest;
}
