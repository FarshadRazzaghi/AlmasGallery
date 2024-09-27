import { Component, ElementRef, ViewEncapsulation, inject } from '@angular/core';

import { _ProductBaseComponent } from '../_product.base.component';
import { ProductHttpService } from '../../../services/http/products/product-http.service';
import { ProductService } from '../product.service';

import { ProductInformationComponent } from './product-information/product-information.component';
import { ProductImageComponent } from './product-image/product-image.component';
import { ProductPricingComponent } from './product-pricing/product-pricing.component';
import { ProductOrganizeComponent } from './product-organize/product-organize.component';
import { ProductVariantComponent } from './product-variant/product-variant.component';
import { ProductInventoryComponent } from './product-inventory/product-inventory.component';

import { convertToModel, convertToRequest } from '../../../types/products/product.type';

import * as FrCard from '@fr-widget/sdk/card';
import * as FrForm from '@fr-widget/sdk/form';

@Component({
  selector: 'product-add-new',
  standalone: true,
  imports: [
    FrForm.FrFormComponent,
    FrForm.FrFormControlComponent,
    FrForm.FrFormControlDirecitveModule,

    FrCard.FrCardComponent,
    FrCard.FrCardHeaderComponent,
    FrCard.FrCardFooterComponent,

    ProductInformationComponent,
    ProductImageComponent,
    ProductPricingComponent,
    ProductOrganizeComponent,
    ProductVariantComponent,
    ProductInventoryComponent
  ],
  templateUrl: './add-new.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [ProductService]
})
export class AddNewComponent extends _ProductBaseComponent {

  protected productHttpService: ProductHttpService = inject(ProductHttpService);
  protected productLoaded: boolean = false;

  private productId?: number;

  constructor(private productService: ProductService, elementRef: ElementRef) {
    super(elementRef);

    // TODO - IF STRINGQUERY HAS ID SET IT TO this.productId
    this.productId = undefined;
  }

  protected override afterViewInit(): void {
    setTimeout(async () => {
      this.productLoaded = true;
      if (this.productId) {
        const product = await this.productHttpService.getSingle(this.productId);
        if (!product) {
          // TODO - REDIRECT TO 404 NOT FOUND PAGE;
          return;
        }

        this.productService.product = convertToModel(product);
      }
    })
  }

  protected override onDestroy(): void {
    this.productService.product = {};
  }

  protected onSubmit = (): void => {
    this.productService.validateForm();

    setTimeout(async () => {
      const formSubmitResults = this.productService.getResults();
      if (formSubmitResults.length > 0) {
        const canSubmit = formSubmitResults.map(x => x.result).every(x => x);

        if (canSubmit) {
          const product = this.productService.product;
          const result = await this.productHttpService.create(convertToRequest(product));

          if (result) { }
        }
      }
    })
  }
}
