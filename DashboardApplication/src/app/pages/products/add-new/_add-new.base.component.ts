import { Component, ViewEncapsulation, inject } from '@angular/core';
import { _ProductBaseComponent } from '../_product.base.component';
import { AddProduct } from '../../../types/products/product.type';
import { ProductService } from '../product.service';

@Component({
  selector: 'product-add-new-base',
  standalone: true,
  imports: [],
  template: '',
  encapsulation: ViewEncapsulation.None,
})
export abstract class _AddNewBaseComponent extends _ProductBaseComponent {

  //#region product
  protected set product(product: AddProduct) {
    this.productService.product = product;
  }
  protected get product(): AddProduct {
    return this.productService.product;
  }
  //#endregion product

  protected productService: ProductService = inject(ProductService);
}
