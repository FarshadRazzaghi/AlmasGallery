import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { _AddNewBaseComponent } from '../_add-new.base.component';
import { ProductPricing } from '../../../../types/products/product.type';

import * as FrForm from '@fr-widget/sdk/form';

@Component({
  selector: 'product-pricing',
  standalone: true,
  imports: [
    FrForm.FrFormComponent,
    FrForm.FrFormControlComponent,
    FrForm.FrFormGroupComponent,
    FrForm.FrFormControlDirecitveModule,
  ],
  templateUrl: './product-pricing.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ProductPricingComponent extends _AddNewBaseComponent {

  @ViewChild('productPricingForm') form!: FrForm.FrFormComponent<ProductPricing>;

  private subscription: Subscription;

  // #region Validators
  protected productBasePriceValidators: FrForm.FrFormControlValidator = {
    required: true,
  };
  protected productDiscountValidators: FrForm.FrFormControlValidator = {
    required: false,
  };
  // #endregion Validators

  constructor(elementRef: ElementRef) {
    super(elementRef);

    this.subscription = this.productService
      .formValidation
      .subscribe(async () => {
        if (this.form) {
          var model = await this.form.onSubmit();
          this.productService.addResult(this.form.id, model.isValid);

          if (model.isValid && model.data) {
            this.product.basePrice = model.data.basePrice;
            this.product.discountPrice = model.data.discountPrice;
            this.product.hasChargeTax = model.data.hasChargeTax;
            this.product.isInStock = model.data.isInStock;
          }
        }
      });
  }

  protected override async afterViewInit(): Promise<void> {
    const model: ProductPricing = {
      basePrice: this.product.basePrice || 0,
      discountPrice: this.product.discountPrice || 0,
      hasChargeTax: this.product.hasChargeTax === undefined ? false : this.product.hasChargeTax,
      isInStock: this.product.isInStock === undefined ? true : this.product.isInStock,
    }
    await this.form.setModel(model);
  }

  protected override onDestroy(): void {
    this.subscription.unsubscribe();
  }
}
