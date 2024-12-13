import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { lastValueFrom } from "rxjs";

import { HttpServiceGeneric } from "../http.service";
import { BaseHttpResponse, PagintaionBaseHttpResponse } from "../../../helper/http/http.interface.ts";

import { ProductUpsertRequest } from "../../../types/products/http/product-request.type";


import * as apiUrl from "../../../helper/http/http.helper";

@Injectable({
  providedIn: 'root'
})
export class ProductHttpService {

  constructor(
    private getListResponse: HttpServiceGeneric<ProductUpsertRequest[]>,
    private getSingleResponse: HttpServiceGeneric<ProductUpsertRequest>) { }

  public getList = async (): Promise<PagintaionBaseHttpResponse<ProductUpsertRequest[]>> => {
    const getListProducts = this.getListResponse.get(apiUrl.productGetList);
    return lastValueFrom(getListProducts)
      .then((response: HttpResponse<ProductUpsertRequest[]>) => {
        const totalCount = +(response.headers.get("X-Total-Count") ?? '0');

        return {
          status: true,
          totalCount: totalCount,
          data: response.body || [],
        }
      })
      .catch((error: HttpErrorResponse) => { return { status: false, message: error.message } });
  }

  public getSingle = async (productId: number): Promise<BaseHttpResponse<ProductUpsertRequest>> => {
    const getSingleProduct = this.getSingleResponse.get(apiUrl.productGetSingle, [productId.toString()]);
    return lastValueFrom(getSingleProduct)
      .then((response: HttpResponse<ProductUpsertRequest>) => { return { status: true, data: response.body! } })
      .catch((error: HttpErrorResponse) => { return { status: false, message: error.message } });
  }

  public create = async (product: ProductUpsertRequest): Promise<BaseHttpResponse<null>> => {
    var createProduct = this.getSingleResponse.post(apiUrl.productCreate, product);
    return lastValueFrom(createProduct)
      .then(() => { return { status: true } })
      .catch((error: HttpErrorResponse) => { return { status: false, message: error.message } });
  }

  public update = async (productId: number, product: ProductUpsertRequest): Promise<BaseHttpResponse<ProductUpsertRequest>> => {
    var createProduct = this.getSingleResponse.post(apiUrl.productUpdate, product, [productId.toString()]);
    return lastValueFrom(createProduct)
      .then((response: HttpResponse<ProductUpsertRequest>) => { return { status: true, data: response.body! } })
      .catch((error: HttpErrorResponse) => { return { status: false, message: error.message } });
  }
}
