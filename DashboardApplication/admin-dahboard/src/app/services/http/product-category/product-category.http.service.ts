import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { lastValueFrom } from "rxjs";

import { HttpServiceGeneric } from "../http.service";
import { BaseHttpResponse, PaginationBaseHttpResponse } from "../../../helper/http/http.interface.ts";

import { ProductCategoryFilter, ProductCategoryRequest } from "../../../types/product-category/product-category-request.type";

import * as apiUrl from "../../../helper/http/http.helper";

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryHttpService {

  constructor(
    private getListResponse: HttpServiceGeneric<ProductCategoryRequest[]>,
    private getSingleResponse: HttpServiceGeneric<ProductCategoryRequest>,
    private booleanResponse: HttpServiceGeneric<boolean>) { }

  public getList = async (filter?: ProductCategoryFilter): Promise<PaginationBaseHttpResponse<ProductCategoryRequest[]>> => {
    const getListProductCategories = this.getListResponse.get(apiUrl.productCategoryGetList, filter);

    return lastValueFrom(getListProductCategories)
      .then((response: HttpResponse<ProductCategoryRequest[]>) => {
        const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

        return {
          status: true,
          totalCount: totalCount,
          data: response.body || [],
        }
      })
      .catch((error: HttpErrorResponse) => { return { status: false, message: error.message } });
  }

  public getSingle = async (productCategoryId: number): Promise<BaseHttpResponse<ProductCategoryRequest>> => {
    const getSingleProductCategory = this.getSingleResponse.get(apiUrl.productCategoryGetSingle, undefined, [productCategoryId.toString()]);
    return lastValueFrom(getSingleProductCategory)
      .then((response: HttpResponse<ProductCategoryRequest>) => { return { status: true, data: response.body! } })
      .catch((error: HttpErrorResponse) => { return { status: false, message: error.message } });
  }

  public create = async (productCategory: ProductCategoryRequest): Promise<BaseHttpResponse<null>> => {
    const createProductCategory = this.getSingleResponse.post(apiUrl.productCategoryCreate, productCategory);
    return lastValueFrom(createProductCategory)
      .then(() => { return { status: true } })
      .catch((error: HttpErrorResponse) => { return { status: false, message: error.message } });
  }

  public update = async (productCategoryId: number, productCategory: ProductCategoryRequest): Promise<BaseHttpResponse<ProductCategoryRequest>> => {
    const updatedProductCategory = this.getSingleResponse.put(apiUrl.productCategoryUpdate, productCategory, undefined, [productCategoryId.toString()]);
    return lastValueFrom(updatedProductCategory)
      .then((response: HttpResponse<ProductCategoryRequest>) => { return { status: true, data: response.body! } })
      .catch((error: HttpErrorResponse) => { return { status: false, message: error.message } });
  }

  public delete = async (productCategoryId: number): Promise<BaseHttpResponse<boolean>> => {
    const deleteProductCategory = this.booleanResponse.delete(apiUrl.productCategoryDelete, undefined, [productCategoryId.toString()]);
    return lastValueFrom(deleteProductCategory)
      .then(() => { return { status: true } })
      .catch((error: HttpErrorResponse) => { return { status: false, message: error.message } });
  }
}
