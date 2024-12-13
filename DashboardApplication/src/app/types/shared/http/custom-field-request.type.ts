import { BaseHttpRequest } from "../../../helper/http/http.interface.ts";

export type EnumListRequest<T> = BaseHttpRequest & {
  name: string;
  value: T;
}
