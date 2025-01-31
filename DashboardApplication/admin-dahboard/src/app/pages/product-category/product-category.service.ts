import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ProductCategoryUpsert } from '../../types/product-category/product-category-upsert.type';
import { ProductCategoryHttpService } from '../../services/http/product-category/product-category.http.service';

@Injectable()
export class ProductCategoryService {

  private _productCategoryHttpService: ProductCategoryHttpService = inject(ProductCategoryHttpService);
  public get httpService() {
    return this._productCategoryHttpService;
  }

  private _productCategory: ProductCategoryUpsert = {};
  public set productCategory(productCategory: ProductCategoryUpsert) {
    this._productCategory = productCategory;
  }
  public get productCategory() {
    return this._productCategory;
  }

  private _resetProductCategory = new BehaviorSubject<boolean>(false);
  public productCategoryReset = this._resetProductCategory.asObservable();
  public resetProductCategory = (option: boolean): void => {
    this._resetProductCategory.next(option);
  }

  private _deleteProductCategory = new BehaviorSubject<boolean>(false);
  public productCategoryDelete = this._deleteProductCategory.asObservable();
  public deleteProductCategory = (option: boolean): void => {
    this._deleteProductCategory.next(option);
  }
}
