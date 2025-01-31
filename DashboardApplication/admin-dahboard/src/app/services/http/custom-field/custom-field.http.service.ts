import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { lastValueFrom } from "rxjs";

import { HttpServiceGeneric } from "../http.service";
import { BaseHttpResponse, PaginationBaseHttpResponse } from "../../../helper/http/http.interface.ts";

import { CustomFieldFilter, CustomFieldRequest } from "../../../types/custom-field/custom-field-request.type";

import * as apiUrl from "../../../helper/http/http.helper";

@Injectable({
	providedIn: 'root'
})
export class CustomFieldHttpService {

	constructor(
		private getListResponse: HttpServiceGeneric<CustomFieldRequest[]>,
		private getSingleResponse: HttpServiceGeneric<CustomFieldRequest>,
		private booleanResponse: HttpServiceGeneric<boolean>) { }

	public getList = async (filter?: CustomFieldFilter): Promise<PaginationBaseHttpResponse<CustomFieldRequest[]>> => {
		const getListCustomFields = this.getListResponse.get(apiUrl.customFieldGroup, filter);

		return lastValueFrom(getListCustomFields)
			.then((response: HttpResponse<CustomFieldRequest[]>) => {
				const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

				return {
					status: true,
					totalCount: totalCount,
					data: response.body || [],
				}
			})
			.catch((error: HttpErrorResponse) => { return { status: false, message: error.message } });
	}

	public getSingle = async (customFieldId: number): Promise<BaseHttpResponse<CustomFieldRequest>> => {
		const getSingleCustomField = this.getSingleResponse.get(apiUrl.customFieldGroup, undefined, [customFieldId.toString()]);
		return lastValueFrom(getSingleCustomField)
			.then((response: HttpResponse<CustomFieldRequest>) => { return { status: true, data: response.body! } })
			.catch((error: HttpErrorResponse) => { return { status: false, message: error.message } });
	}

	public create = async (customField: CustomFieldRequest): Promise<BaseHttpResponse<null>> => {
		const createCustomField = this.getSingleResponse.post(apiUrl.customFieldGroup, customField);
		return await lastValueFrom(createCustomField)
			.then(() => { return { status: true } })
			.catch((error: HttpErrorResponse) => { return { status: false, message: error.message } });
	}

	public update = async (customFieldId: number, customField: CustomFieldRequest): Promise<BaseHttpResponse<CustomFieldRequest>> => {
		const createCustomField = this.getSingleResponse.put(apiUrl.customFieldGroup, customField, undefined, [customFieldId.toString()]);
		return lastValueFrom(createCustomField)
			.then((response: HttpResponse<CustomFieldRequest>) => { return { status: true, data: response.body! } })
			.catch((error: HttpErrorResponse) => { return { status: false, message: error.message } });
	}

	public delete = async (customFieldId: number): Promise<BaseHttpResponse<boolean>> => {
		const createCustomField = this.booleanResponse.delete(apiUrl.customFieldGroup, undefined, [customFieldId.toString()]);
		return lastValueFrom(createCustomField)
			.then(() => { return { status: true } })
			.catch((error: HttpErrorResponse) => { return { status: false, message: error.message } });
	}
}
