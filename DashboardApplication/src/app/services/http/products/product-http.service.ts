import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";

import { HttpServiceGeneric } from "../http.service";
import { ProductUpsertRequest } from "../../../types/products/http/product-request.type";

import * as apiUrl from "../../../helper/http/http.helper";

@Injectable({
  providedIn: 'root'
})
export class ProductHttpService {

  constructor(
    private getListResponse: HttpServiceGeneric<ProductUpsertRequest[]>,
    private getSingleResponse: HttpServiceGeneric<ProductUpsertRequest>) { }

  public getList = async (): Promise<ProductUpsertRequest[]> => {
    const getListProducts = this.getListResponse.get(apiUrl.productGetList);
    return lastValueFrom(getListProducts);
  }

  public getSingle = async (productId: number): Promise<ProductUpsertRequest | null> => {
    const getSingleProduct = this.getSingleResponse.get(apiUrl.productGetSingle, [productId.toString()]);
    return lastValueFrom(getSingleProduct);
  }

  public create = async (product: ProductUpsertRequest): Promise<ProductUpsertRequest | null> => {
    var createProduct = this.getSingleResponse.post(apiUrl.productCreate, product);
    return lastValueFrom(createProduct);
  }

  public update = async (productId: number, product: ProductUpsertRequest): Promise<ProductUpsertRequest | null> => {
    var createProduct = this.getSingleResponse.post(apiUrl.productUpdate, product, [productId.toString()]);
    return lastValueFrom(createProduct);
  }
}
