import { BaseHttpRequest } from "../../helper/http/http.interface.ts";

export type CustomFieldRequest = BaseHttpRequest & {
  name: string;
  entityType: number;
  customFields?: CustomFieldOptionRequest[];
}

export type CustomFieldOptionRequest = BaseHttpRequest & {
  name: string;
  dataType: number;

  isActive: boolean;
  isRequired: boolean;

  helpText?: string;
  placeHolder?: string;

  initialValue?: string;
  validation?: string;

  parentUniqueId?: string;
  parentCondition?: string;
}
