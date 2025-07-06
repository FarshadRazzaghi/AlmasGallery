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
 * Last generated: 2025-05-16T11:05:39.036Z
 * Generator version: 1.0.0
 *
 * @generated
 */

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

import { HttpAuthService } from "../helpers/http-auto.service.generated";
import { HttpHelper } from "../helpers/helper.generated";
import { BaseHttpResponse } from "../helpers/interface.generated";
import { HttpServiceGeneric } from "../helpers/http.service.generated";

import * as models from "../api-schematics.generator";

@Injectable({ providedIn: 'root' })
export class CustomFieldGroupsHttpService extends HttpServiceGeneric {

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
  public async getAllCustomFieldGroups(includeCustomFields?: boolean, groupType?: models.CustomFieldGroupEntityType[], groupName?: string[], page?: number, pageSize?: number): Promise<BaseHttpResponse<models.CustomFieldGroupResponse[]>> {

    let url = `/api/v1/custom-field-groups`;
    
        const queryString = HttpHelper.getQueryString({includeCustomFields, groupType, groupName, page, pageSize});
        if (queryString) {
            url += `?${queryString}`;
        }

    const response = await firstValueFrom(
      this.get<models.CustomFieldGroupResponse[]>(
        url
      )
    );
    const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

    return {
      status: true,
      totalCount,
      data: response.body!
    };
  }
  
  /**
  * Adds a new custom field group to the system with the provided details.
  * @method POST
  * @path /api/v1/custom-field-groups
   * @param {models.CustomFieldGroupRequest} body - Request body
  * @returns {Promise<BaseHttpResponse<models.CustomFieldGroupResponse>>} models.CustomFieldGroupResponse response
  */
  public async createCustomFieldGroup(body: models.CustomFieldGroupRequest): Promise<BaseHttpResponse<models.CustomFieldGroupResponse>> {

    let url = `/api/v1/custom-field-groups`;
    

    const response = await firstValueFrom(
      this.post<models.CustomFieldGroupRequest, models.CustomFieldGroupResponse>(
        url, body
      )
    );
    const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

    return {
      status: true,
      totalCount,
      data: response.body!
    };
  }
  
  /**
  * Fetches a list of custom field groups associated with a specific product category, based on the provided filter, including their associated details.
  * @method GET
  * @path /api/v1/custom-field-groups/product-groups/{productCategoryId}/{activeOnly}
   * @param {number} productCategoryId - No description available
 * @param {boolean} activeOnly - No description available
  * @returns {Promise<BaseHttpResponse<models.CustomFieldGroupResponse[]>>} models.CustomFieldGroupResponse[] response
  */
  public async getCustomFieldGroupsForProductCategory(productCategoryId: number, activeOnly: boolean): Promise<BaseHttpResponse<models.CustomFieldGroupResponse[]>> {

    let url = `/api/v1/custom-field-groups/product-groups/${productCategoryId}/${activeOnly}`;
    

    const response = await firstValueFrom(
      this.get<models.CustomFieldGroupResponse[]>(
        url
      )
    );
    const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

    return {
      status: true,
      totalCount,
      data: response.body!
    };
  }
  
  /**
  * Fetches a single custom field group by the specified ID, including its associated custom fields.
  * @method GET
  * @path /api/v1/custom-field-groups/{customFieldGroupId}
   * @param {number} customFieldGroupId - No description available
  * @returns {Promise<BaseHttpResponse<models.CustomFieldGroupResponse>>} models.CustomFieldGroupResponse response
  */
  public async getCustomFieldGroupById(customFieldGroupId: number): Promise<BaseHttpResponse<models.CustomFieldGroupResponse>> {

    let url = `/api/v1/custom-field-groups/${customFieldGroupId}`;
    

    const response = await firstValueFrom(
      this.get<models.CustomFieldGroupResponse>(
        url
      )
    );
    const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

    return {
      status: true,
      totalCount,
      data: response.body!
    };
  }
  
  /**
  * Updates the details of an existing custom field group identified by the specified ID.
  * @method PUT
  * @path /api/v1/custom-field-groups/{customFieldGroupId}
   * @param {number} customFieldGroupId - No description available
 * @param {models.CustomFieldGroupRequest} body - Request body
  * @returns {Promise<BaseHttpResponse<models.CustomFieldGroupResponse>>} models.CustomFieldGroupResponse response
  */
  public async updateCustomFieldGroupById(customFieldGroupId: number, body: models.CustomFieldGroupRequest): Promise<BaseHttpResponse<models.CustomFieldGroupResponse>> {

    let url = `/api/v1/custom-field-groups/${customFieldGroupId}`;
    

    const response = await firstValueFrom(
      this.put<models.CustomFieldGroupRequest, models.CustomFieldGroupResponse>(
        url, body
      )
    );
    const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

    return {
      status: true,
      totalCount,
      data: response.body!
    };
  }
  
  /**
  * Deletes an existing custom field group identified by the specified ID.
  * @method DELETE
  * @path /api/v1/custom-field-groups/{customFieldGroupId}
   * @param {number} customFieldGroupId - No description available
  * @returns {Promise<BaseHttpResponse<void>>} void response
  */
  public async deleteCustomFieldGroupById(customFieldGroupId: number): Promise<BaseHttpResponse<void>> {

    let url = `/api/v1/custom-field-groups/${customFieldGroupId}`;
    

    const response = await firstValueFrom(
      this.delete<void>(
        url
      )
    );
    const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

    return {
      status: true,
      totalCount,
      data: response.body!
    };
  }
  
}
