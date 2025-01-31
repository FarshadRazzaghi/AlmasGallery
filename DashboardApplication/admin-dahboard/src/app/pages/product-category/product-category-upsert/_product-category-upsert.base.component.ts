import { Component, ViewEncapsulation, inject } from '@angular/core';

import { _ProductCategoryBaseComponent } from '../_product-category.base.component';

import { ProductCategoryService } from '../product-category.service';
import { ProductCategoryUpsert } from '../../../types/product-category/product-category-upsert.type';

@Component({
  selector: 'product-category-upsert-base',
  standalone: true,
  imports: [],
  template: '',
  encapsulation: ViewEncapsulation.None,
})
export abstract class _ProductCategoryUpsertBaseComponent extends _ProductCategoryBaseComponent {

  //#region productCategory
  protected set productCategory(productCategory: ProductCategoryUpsert) {
    this.productCategoryService.productCategory = productCategory;
  }
  protected get productCategory(): ProductCategoryUpsert {
    return this.productCategoryService.productCategory;
  }
  //#endregion productCategory

  protected productCategoryService: ProductCategoryService = inject(ProductCategoryService);
}
