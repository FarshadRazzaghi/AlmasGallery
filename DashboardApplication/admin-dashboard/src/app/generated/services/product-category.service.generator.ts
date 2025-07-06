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
export class ProductCategoryHttpService extends HttpServiceGeneric {

	constructor(http: HttpClient, authService: HttpAuthService) {
		super(http, authService);
	}

  
  /**
  * Fetches a list of all product categories based on the provided filter, including their associated details.
  * @method GET
  * @path /api/v1/product-categories
   * @param {boolean} includeCustomFieldGroups - No description available
 * @param {number} page - No description available
 * @param {number} pageSize - No description available
  * @returns {Promise<BaseHttpResponse<models.ProductCategoryResponse[]>>} models.ProductCategoryResponse[] response
  */
  public async getAllProductCategories(includeCustomFieldGroups?: boolean, page?: number, pageSize?: number): Promise<BaseHttpResponse<models.ProductCategoryResponse[]>> {

    let url = `/api/v1/product-categories`;
    
        const queryString = HttpHelper.getQueryString({includeCustomFieldGroups, page, pageSize});
        if (queryString) {
            url += `?${queryString}`;
        }

    const response = await firstValueFrom(
      this.get<models.ProductCategoryResponse[]>(
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
  * Adds a new product category to the system with the provided details.
  * @method POST
  * @path /api/v1/product-categories
   * @param {models.ProductCategoryRequest} body - Request body
  * @returns {Promise<BaseHttpResponse<models.ProductCategoryResponse>>} models.ProductCategoryResponse response
  */
  public async createProductCategory(body: models.ProductCategoryRequest): Promise<BaseHttpResponse<models.ProductCategoryResponse>> {

    let url = `/api/v1/product-categories`;
    

    const response = await firstValueFrom(
      this.post<models.ProductCategoryRequest, models.ProductCategoryResponse>(
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
  * Fetches a list of product categories formatted as key-value pairs for use in dropdown options.
  * @method GET
  * @path /api/v1/product-categories/dropdown
  
  * @returns {Promise<BaseHttpResponse<models.DropdownResponse[]>>} models.DropdownResponse[] response
  */
  public async getProductCategoriesForDropdown(): Promise<BaseHttpResponse<models.DropdownResponse[]>> {

    let url = `/api/v1/product-categories/dropdown`;
    

    const response = await firstValueFrom(
      this.get<models.DropdownResponse[]>(
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
  * Fetches a single product category by the specified ID, including its associated custom field groups.
  * @method GET
  * @path /api/v1/product-categories/{productCategoryId}
   * @param {number} productCategoryId - No description available
  * @returns {Promise<BaseHttpResponse<models.ProductCategoryResponse>>} models.ProductCategoryResponse response
  */
  public async getProductCategoryById(productCategoryId: number): Promise<BaseHttpResponse<models.ProductCategoryResponse>> {

    let url = `/api/v1/product-categories/${productCategoryId}`;
    

    const response = await firstValueFrom(
      this.get<models.ProductCategoryResponse>(
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
  * Updates the details of an existing product category identified by the specified ID.
  * @method PUT
  * @path /api/v1/product-categories/{productCategoryId}
   * @param {number} productCategoryId - No description available
 * @param {models.ProductCategoryRequest} body - Request body
  * @returns {Promise<BaseHttpResponse<models.ProductCategoryResponse>>} models.ProductCategoryResponse response
  */
  public async updateProductCategoryById(productCategoryId: number, body: models.ProductCategoryRequest): Promise<BaseHttpResponse<models.ProductCategoryResponse>> {

    let url = `/api/v1/product-categories/${productCategoryId}`;
    

    const response = await firstValueFrom(
      this.put<models.ProductCategoryRequest, models.ProductCategoryResponse>(
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
  * Deletes an existing product category identified by the specified ID.
  * @method DELETE
  * @path /api/v1/product-categories/{productCategoryId}
   * @param {number} productCategoryId - No description available
  * @returns {Promise<BaseHttpResponse<void>>} void response
  */
  public async deleteProductCategoryById(productCategoryId: number): Promise<BaseHttpResponse<void>> {

    let url = `/api/v1/product-categories/${productCategoryId}`;
    

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
