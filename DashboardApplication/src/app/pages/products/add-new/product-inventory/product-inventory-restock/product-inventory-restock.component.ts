import { Component, ElementRef, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { _AddNewBaseComponent } from '../../_add-new.base.component';
import { ProductRestock } from '../../../../../types/products/product.type';

import * as FrForm from '@fr-widget/sdk/form';

@Component({
  selector: 'product-inventory-restock',
  standalone: true,
  imports: [
    FrForm.FrFormComponent,
    FrForm.FrFormControlComponent,
    FrForm.FrFormGroupComponent,
    FrForm.FrFormControlDirecitveModule,
  ],
  templateUrl: './product-inventory-restock.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ProductInventoryRestockComponent extends _AddNewBaseComponent {

  @ViewChild('productInventoryRestockForm') form!: FrForm.FrFormComponent<ProductRestock>;

  @Output() protected validate: EventEmitter<boolean> = new EventEmitter<boolean>();

  private subscription: Subscription;

  // TODO - NEEDS TO GET DATA FROM DATABASE
  protected currentQuantity: number = 0;
  protected deliveryQuantity: number = 0;
  protected overallQuantity: number = 0;
  protected restockedLastTime: string = '--';

  // #region Validators
  protected productQuantityValidators: FrForm.FrFormControlValidator = {
    required: true
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

          if (model.isValid && model.data) {
            this.product.quantity = model.data.quantity || 0;
          }
        }
      });
  }

  protected override async afterViewInit(): Promise<void> {
    const model: ProductRestock = {
      quantity: this.product.quantity || 0,
    };
    await this.form.setModel(model);
  }

  protected override onDestroy(): void {
    this.subscription.unsubscribe();
  }
}
