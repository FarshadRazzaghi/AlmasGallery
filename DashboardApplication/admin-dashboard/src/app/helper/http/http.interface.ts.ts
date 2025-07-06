import { BaseHttpResponse } from "../../generated/API-Helper/api.interface.generated";

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

export interface DropdownHttpRequest {
	key: number;
	value: string;
}

export interface PaginationBaseHttpResponse<T> extends BaseHttpResponse<T> {
	totalCount: number;
}

export interface DropdownHttpResponse {
	key: number;
	value: string;
}
