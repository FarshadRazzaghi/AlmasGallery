/* eslint-disable prefer-const */
/**
 * @fileoverview
 * ⚠️ WARNING: This file is auto-generated. ⚠️
 *
 * Any manual changes to this file will be overwritten when the code is regenerated.
 * If you need to modify the API functionality, please:
 * 1. Modify the API generator templates
 * 2. Re-run the code generation process
 *
 * Last generated: 2025-07-02T20:54:56.657Z
 * Generator version: 1.0.0
 *
 * @generated
 */

import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

import { HttpAuthService } from "../helpers/http-auth.service.generated";
import { HttpHelper } from "../helpers/helper.generated";
import { BaseHttpResponse, RequestOptions } from "../helpers/interface.generated";
import { HttpServiceGeneric } from "../helpers/http.service.generated";

import * as models from "../api-schematics.generator";

@Injectable({ providedIn: 'root' })
export class CustomFieldGroupHttpService extends HttpServiceGeneric {

	constructor(http: HttpClient, authService: HttpAuthService) {
		super(http, authService);
	}

  
  /**
  * Fetches a list of all custom field groups based on the provided filter, including their associated details.
  * @method GET
  * @path /api/v1/custom-field-groups
   * @param {boolean} includeCustomFields - No description available
 * @param {models.CustomFieldGroupEntityType[]} groupType - No description available
 * @param {string[]} groupName - No description available
 * @param {number} page - No description available
 * @param {number} pageSize - No description available
  * @returns {Promise<BaseHttpResponse<models.CustomFieldGroupResponse[]>>} models.CustomFieldGroupResponse[] response
  */
  public async getAllCustomFieldGroups(includeCustomFields?: boolean, groupType?: models.CustomFieldGroupEntityType[], groupName?: string[], page?: number, pageSize?: number, options?: RequestOptions): Promise<BaseHttpResponse<models.CustomFieldGroupResponse[]>> {

    try {
      let url = `/api/v1/custom-field-groups`;
      
        const queryString = HttpHelper.getQueryString({includeCustomFields, groupType, groupName, page, pageSize});
        if (queryString) {
            url += `?${queryString}`;
        }

      const response = await firstValueFrom(
        this.get<models.CustomFieldGroupResponse[]>(
          url, undefined, options
        )
      );
      const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

      return {
        status: true,
        totalCount,
        data: response.body!
      };
    }
    catch (error: any) {
      return {
        status: false,
        errorCode: (error as HttpErrorResponse).status,
        message: (error as HttpErrorResponse).message || 'An error occurred',
      }
    }
  }
  
  /**
  * Adds a new custom field group to the system with the provided details.
  * @method POST
  * @path /api/v1/custom-field-groups
   * @param {models.CustomFieldGroupRequest} body - Request body
  * @returns {Promise<BaseHttpResponse<models.CustomFieldGroupResponse>>} models.CustomFieldGroupResponse response
  */
  public async createCustomFieldGroup(body: models.CustomFieldGroupRequest, options?: RequestOptions): Promise<BaseHttpResponse<models.CustomFieldGroupResponse>> {

    try {
      let url = `/api/v1/custom-field-groups`;
      

      const response = await firstValueFrom(
        this.post<models.CustomFieldGroupRequest, models.CustomFieldGroupResponse>(
          url, body, undefined, options
        )
      );
      const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

      return {
        status: true,
        totalCount,
        data: response.body!
      };
    }
    catch (error: any) {
      return {
        status: false,
        errorCode: (error as HttpErrorResponse).status,
        message: (error as HttpErrorResponse).message || 'An error occurred',
      }
    }
  }
  
  /**
  * Fetches a list of custom field groups formatted as key-value pairs for use in dropdown options.
  * @method GET
  * @path /api/v1/custom-field-groups/dropdown
  
  * @returns {Promise<BaseHttpResponse<models.DropdownResponse[]>>} models.DropdownResponse[] response
  */
  public async getCustomFieldGroupsForDropdown(options?: RequestOptions): Promise<BaseHttpResponse<models.DropdownResponse[]>> {

    try {
      let url = `/api/v1/custom-field-groups/dropdown`;
      

      const response = await firstValueFrom(
        this.get<models.DropdownResponse[]>(
          url, undefined, options
        )
      );
      const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

      return {
        status: true,
        totalCount,
        data: response.body!
      };
    }
    catch (error: any) {
      return {
        status: false,
        errorCode: (error as HttpErrorResponse).status,
        message: (error as HttpErrorResponse).message || 'An error occurred',
      }
    }
  }
  
  /**
  * Fetches a list of custom field groups associated with a specific product category, based on the provided filter, including their associated details.
  * @method GET
  * @path /api/v1/custom-field-groups/product-groups/{productCategoryId}/{activeOnly}
   * @param {number} productCategoryId - No description available
 * @param {boolean} activeOnly - No description available
  * @returns {Promise<BaseHttpResponse<models.CustomFieldGroupResponse[]>>} models.CustomFieldGroupResponse[] response
  */
  public async getCustomFieldGroupsForProductCategory(productCategoryId: number, activeOnly: boolean, options?: RequestOptions): Promise<BaseHttpResponse<models.CustomFieldGroupResponse[]>> {

    try {
      let url = `/api/v1/custom-field-groups/product-groups/${productCategoryId}/${activeOnly}`;
      

      const response = await firstValueFrom(
        this.get<models.CustomFieldGroupResponse[]>(
          url, undefined, options
        )
      );
      const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

      return {
        status: true,
        totalCount,
        data: response.body!
      };
    }
    catch (error: any) {
      return {
        status: false,
        errorCode: (error as HttpErrorResponse).status,
        message: (error as HttpErrorResponse).message || 'An error occurred',
      }
    }
  }
  
  /**
  * Fetches a single custom field group by the specified ID, including its associated custom fields.
  * @method GET
  * @path /api/v1/custom-field-groups/{customFieldGroupId}
   * @param {number} customFieldGroupId - No description available
  * @returns {Promise<BaseHttpResponse<models.CustomFieldGroupResponse>>} models.CustomFieldGroupResponse response
  */
  public async getCustomFieldGroupById(customFieldGroupId: number, options?: RequestOptions): Promise<BaseHttpResponse<models.CustomFieldGroupResponse>> {

    try {
      let url = `/api/v1/custom-field-groups/${customFieldGroupId}`;
      

      const response = await firstValueFrom(
        this.get<models.CustomFieldGroupResponse>(
          url, undefined, options
        )
      );
      const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

      return {
        status: true,
        totalCount,
        data: response.body!
      };
    }
    catch (error: any) {
      return {
        status: false,
        errorCode: (error as HttpErrorResponse).status,
        message: (error as HttpErrorResponse).message || 'An error occurred',
      }
    }
  }
  
  /**
  * Updates the details of an existing custom field group identified by the specified ID.
  * @method PUT
  * @path /api/v1/custom-field-groups/{customFieldGroupId}
   * @param {number} customFieldGroupId - No description available
 * @param {models.CustomFieldGroupRequest} body - Request body
  * @returns {Promise<BaseHttpResponse<models.CustomFieldGroupResponse>>} models.CustomFieldGroupResponse response
  */
  public async updateCustomFieldGroupById(customFieldGroupId: number, body: models.CustomFieldGroupRequest, options?: RequestOptions): Promise<BaseHttpResponse<models.CustomFieldGroupResponse>> {

    try {
      let url = `/api/v1/custom-field-groups/${customFieldGroupId}`;
      

      const response = await firstValueFrom(
        this.put<models.CustomFieldGroupRequest, models.CustomFieldGroupResponse>(
          url, body, undefined, options
        )
      );
      const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

      return {
        status: true,
        totalCount,
        data: response.body!
      };
    }
    catch (error: any) {
      return {
        status: false,
        errorCode: (error as HttpErrorResponse).status,
        message: (error as HttpErrorResponse).message || 'An error occurred',
      }
    }
  }
  
  /**
  * Deletes an existing custom field group identified by the specified ID.
  * @method DELETE
  * @path /api/v1/custom-field-groups/{customFieldGroupId}
   * @param {number} customFieldGroupId - No description available
  * @returns {Promise<BaseHttpResponse<void>>} void response
  */
  public async deleteCustomFieldGroupById(customFieldGroupId: number, options?: RequestOptions): Promise<BaseHttpResponse<void>> {

    try {
      let url = `/api/v1/custom-field-groups/${customFieldGroupId}`;
      

      const response = await firstValueFrom(
        this.delete<void>(
          url, undefined, options
        )
      );
      const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

      return {
        status: true,
        totalCount,
        data: response.body!
      };
    }
    catch (error: any) {
      return {
        status: false,
        errorCode: (error as HttpErrorResponse).status,
        message: (error as HttpErrorResponse).message || 'An error occurred',
      }
    }
  }
  
}
