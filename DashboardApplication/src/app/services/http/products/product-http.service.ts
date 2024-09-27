import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { HttpServiceGeneric } from "../http.service";
import { ProductRequest } from "../../../types/products/http/product-request.type";

import * as apiUrl from "../../../helper/http/http.helper";

@Injectable({
  providedIn: 'root'
})
export class ProductHttpService {

  constructor(
    private getListResponse: HttpServiceGeneric<ProductRequest[]>,
    private getSingleResponse: HttpServiceGeneric<ProductRequest>) { }

  public getList = async (): Promise<ProductRequest[]> => {
    return await this.getListResponse.get(apiUrl.productGetList)
      .then(async (res: ProductRequest[] | HttpErrorResponse) => {

        if (res instanceof HttpErrorResponse) {
          return [];
        }

        if (!res) {
          return [];
        }

        return res;
      })
      .catch(() => {
        return [];
      });
  }

  public getSingle = async (id: number): Promise<ProductRequest | null> => {
    return await this.getSingleResponse.get(apiUrl.productGetSingle, [`${id}`])
      .then(async (res: ProductRequest | null | HttpErrorResponse) => {

        if (res instanceof HttpErrorResponse) {
          return null;
        }

        if (!res) {
          return null;
        }

        return res;
      })
      .catch(() => {
        return null;
      });
  }

  public create = async (product: ProductRequest): Promise<ProductRequest | null> => {
    return await this.getSingleResponse.post(apiUrl.productCreate, product)
      .then(async (res: ProductRequest | null | HttpErrorResponse) => {

        if (res instanceof HttpErrorResponse) {
          return null;
        }

        if (!res) {
          return null;
        }

        return res;
      })
      .catch(() => {
        return null;
      });
  }
}
