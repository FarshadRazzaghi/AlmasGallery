import { Component, ElementRef, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { _AddNewBaseComponent } from '../../_add-new.base.component';
import { ProductShipping } from '../../../../../types/products/product.type';

import * as FrForm from '@fr-widget/sdk/form';

@Component({
  selector: 'product-inventory-shipping',
  standalone: true,
  imports: [
    FrForm.FrFormComponent,
    FrForm.FrFormControlComponent,
    FrForm.FrFormGroupComponent,
    FrForm.FrFormControlDirecitveModule
  ],
  templateUrl: './product-inventory-shipping.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ProductInventoryShippingComponent extends _AddNewBaseComponent {

  protected get ProductShippingTypeItems(): FrForm.FrInputValueItem<number>[] {
    return [{

      key: this.sanitizer.bypassSecurityTrustHtml(`<span class="mb-1 h6 d-block">${this.productResource.sellerFulfilled}</span><small>${this.productResource.sellerFulfilledDescription}</small>`),
      value: 1,
      order: 0,
      selectable: true
    },
    {
      key: this.sanitizer.bypassSecurityTrustHtml(`<span class="mb-1 h6 d-block">${this.productResource.companyFullfilled}<small class="badge bg-warning">${this.appplicationResource.recommended}</small></span><small>${this.productResource.companyFullfilledDescription}</small>`),
      value: 2,
      order: 1,
      selectable: true
    }]
  };

  @ViewChild('productInventoryShippingForm') form!: FrForm.FrFormComponent<ProductShipping>;

  @Output() protected validate: EventEmitter<boolean> = new EventEmitter<boolean>();

  private subscription: Subscription;

  // #region Validators
  protected productShippingTypeValidators: FrForm.FrFormControlValidator = {};
  // #endregion Validators

  constructor(private sanitizer: DomSanitizer, elementRef: ElementRef) {
    super(elementRef);

    this.subscription = this.productService
      .formValidation
      .subscribe(async () => {
        if (this.form) {
          var model = await this.form.onSubmit();
          this.productService.addResult(this.form.id, model.isValid);
          this.validate.emit(model.isValid);

          if (model.isValid && model.data) {
            this.product.shippingType = model.data.shippingType;
          }
        }
      });
  }

  protected override async afterViewInit(): Promise<void> {
    const model: ProductShipping = {
      shippingType: this.product.shippingType || 1
    };
    await this.form.setModel(model);
  }

  protected override onDestroy(): void {
    this.subscription.unsubscribe();
  }
}
