import { Component, ViewEncapsulation, inject } from '@angular/core';

import { _ProductBaseComponent } from '../_product.base.component';

import { ProductUpsert } from '../../../types/products/product-upsert.type';
import { ProductService } from '../product.service';

@Component({
  selector: 'product-upsert-base',
  standalone: true,
  imports: [],
  template: '',
  encapsulation: ViewEncapsulation.None,
})
export abstract class _ProductUpsertBaseComponent extends _ProductBaseComponent {

  //#region product
  protected set product(product: ProductUpsert) {
    this.productService.product = product;
  }
  protected get product(): ProductUpsert {
    return this.productService.product;
  }
  //#endregion product

  protected productService: ProductService = inject(ProductService);
}
