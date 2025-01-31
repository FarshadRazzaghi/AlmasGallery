export interface BaseQueryStringFilter {
  id?: string;
}

export interface PaginationFilter extends BaseQueryStringFilter {
  pageSize?: number;
  page?: number;
}

export interface BaseHttpRequest {
  id?: number;
  dateStamp?: Date;
  createdAt?: Date;
  modifiedAt?: Date;
  status?: number;
}

export interface BaseHttpResponse<TDataType> {
  status: boolean;
  message?: string;
  data?: TDataType;
}

export interface PaginationBaseHttpResponse<TDtaType> extends BaseHttpResponse<TDtaType> {
  totalCount?: number;
}
