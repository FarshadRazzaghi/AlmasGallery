export interface BaseHttpRequest {
  id?: number,
  dateStamp?: Date,
  createdAt?: Date,
  modifiedAt?: Date,
  status?: number,
}

export interface BaseHttpResponse<TDataType> {
  status: boolean;
  message?: string;
  data?: TDataType;
}

export interface PaginationBaseHttpResponse<TDtaType> extends BaseHttpResponse<TDtaType> {
  totalCount?: number;
}
