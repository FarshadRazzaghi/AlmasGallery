import { Component, ElementRef, ViewEncapsulation, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FrWidgetError } from '@fr-widget/sdk';

import { _ProductBaseComponent } from '../_product.base.component';
import { ProductHttpService } from '../../../services/http/products/product-http.service';
import { ProductService } from '../product.service';

import { ProductInformationComponent } from './product-information/product-information.component';
import { ProductImageComponent } from './product-image/product-image.component';
import { ProductPricingComponent } from './product-pricing/product-pricing.component';
import { ProductOrganizeComponent } from './product-organize/product-organize.component';
import { ProductVariantComponent } from './product-variant/product-variant.component';
import { ProductInventoryComponent } from './product-inventory/product-inventory.component';
import { ProductUpsertRequest } from '../../../types/products/http/product-request.type';

import { convertToModel, convertToRequest } from '../../../types/products/product-upsert.type';

import * as FrCard from '@fr-widget/sdk/card';
import * as FrForm from '@fr-widget/sdk/form';

@Component({
  selector: 'product-upsert',
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
  templateUrl: './product-upsert.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [ProductService]
})
export class ProductUpsertComponent extends _ProductBaseComponent {

  protected productHttpService: ProductHttpService = inject(ProductHttpService);
  protected productLoaded: boolean = false;

  private productId?: number;
  private operation: 'AddNew' | 'Update' = 'AddNew';
  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, elementRef: ElementRef) {
    super(elementRef);

    this.operation = 'AddNew';
    const param = this.activatedRoute.snapshot.paramMap.get('id');

    if (param) {
      const castedParam = +param;
      if (isNaN(castedParam)) {
        throw new FrWidgetError("PAGE NOT  FOUND");
      }

      this.productId = castedParam;
      this.operation = 'Update';
    }
  }

  protected override afterViewInit(): void {
    setTimeout(async () => {
      this.productLoaded = false;

      if ((this.productId || this.productId == 0) && this.operation === 'Update') {
        const product = await this.productHttpService.getSingle(this.productId);
        if (!product) {
          // TODO - REDIRECT TO 404 NOT FOUND PAGE;
          throw new FrWidgetError("PAGE NOT  FOUND");
        }

        this.productService.product = convertToModel(product);
      }

      this.productLoaded = true;
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
          let result: ProductUpsertRequest | null = null;
          const requestModel = convertToRequest(this.productService.product);

          if (this.operation === 'AddNew') {
            result = await this.productHttpService.create(requestModel);
          }
          else {
            result = await this.productHttpService.update(this.productId ?? 0, requestModel);
          }

          if (result) { }


        }
      }
    })
  }
}
