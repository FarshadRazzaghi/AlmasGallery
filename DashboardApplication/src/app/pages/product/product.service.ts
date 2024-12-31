import { Injectable } from '@angular/core';
import { ProductUpsert } from '../../types/product/product-upsert.type';

@Injectable()
export class ProductService {

  private _product: ProductUpsert = {};
  public set product(product: ProductUpsert) {
    this._product = product;
  }
  public get product() {
    return this._product;
  }
}
