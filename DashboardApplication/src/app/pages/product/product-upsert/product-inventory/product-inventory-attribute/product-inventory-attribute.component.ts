import { Component, ElementRef, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { _ProductUpsertBaseComponent } from '../../_product-upsert.base.component';
import { ProductUpsertAttribute } from '../../../../../types/products/product-upsert.type';

import * as FrForm from '@fr-widget/sdk/form';

@Component({
  selector: 'product-inventory-attribute',
  standalone: true,
  imports: [
    FrForm.FrFormComponent,
    FrForm.FrFormControlComponent,
    FrForm.FrFormGroupComponent,
    FrForm.FrFormControlDirecitveModule
  ],
  templateUrl: './product-inventory-attribute.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ProductInventoryAttributeComponent extends _ProductUpsertBaseComponent {

  @ViewChild('productInventoryAttributeForm') form!: FrForm.FrFormComponent<ProductUpsertAttribute>;

  @Output() protected validate: EventEmitter<boolean> = new EventEmitter<boolean>();

  private subscription: Subscription;
  protected hasExpiryDateSelected: boolean = false;
  protected isFrozenSelected: boolean = false;

  // #region Validators
  protected productAllowedTemperatureValidators: FrForm.FrFormControlValidator = {
    required: true,
  };
  protected productExpiryDateValidators: FrForm.FrFormControlValidator = {
    required: true,
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
          this.validate.emit(model.isValid);

          if (this.product && model.isValid && model.data) {
            delete this.product.allowedTemperature;
            delete this.product.expiryDate;

            this.product.isFragile = model.data.isFragile;
            this.product.isBiodegradable = model.data.isBiodegradable;

            this.product.isFrozen = model.data.isFrozen;
            if (model.data.isFrozen) {
              this.product.allowedTemperature = model.data.allowedTemperature;
            }

            this.product.hasExpiryDate = model.data.hasExpiryDate;
            if (model.data.hasExpiryDate) {
              this.product.expiryDate = model.data.expiryDate;
            }
          }
        }
      });
  }

  protected override async afterViewInit(): Promise<void> {
    setTimeout(() => {
      this.isFrozenSelected = this.product.isFrozen ?? false;
      this.hasExpiryDateSelected = this.product.hasExpiryDate ?? false;
    })

    const model: ProductUpsertAttribute = {
      hasExpiryDate: this.product.hasExpiryDate || false,
      isBiodegradable: this.product.isBiodegradable || false,
      isFragile: this.product.isFragile || false,
      isFrozen: this.product.isFrozen || false,
      allowedTemperature: this.product.allowedTemperature,
      expiryDate: this.product.expiryDate
    };
    await this.form.setModel(model);
  }

  protected override onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected onIsFrozenChanged = ($event: FrForm.FrFormControlChangeResult<boolean, Event>): void => {
    this.isFrozenSelected = $event.value ?? false;
  }

  protected onHasExpiryDateChanged = ($event: FrForm.FrFormControlChangeResult<boolean, Event>): void => {
    this.hasExpiryDateSelected = $event.value ?? false;
  }
}
