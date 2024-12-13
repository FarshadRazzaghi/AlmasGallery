import { BaseHttpRequest } from "../../../helper/http/http.interface.ts";

export type CustomFieldRequest = BaseHttpRequest & {
  name: string;
  entityType: number;
  customFields?: CustomFieldOptionRequest[];
}

export type CustomFieldOptionRequest = BaseHttpRequest & {
  name: string;
  dataType: number;
  helpText?: string;
  placeHolder?: string;

  isActive: boolean;
  isRequired: boolean;

  initialValue?: string;
  validation?: string;

  customFieldParent?: string;
  parentCondition?: string;

  children?: CustomFieldOptionRequest[];
}
