import { Component, ElementRef, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { _AddNewBaseComponent } from '../../_add-new.base.component';
import { ProductGlobalDelivery } from '../../../../../types/products/product.type';

import * as FrForm from '@fr-widget/sdk/form';

@Component({
  selector: 'product-inventory-global-delivery',
  standalone: true,
  imports: [
    FrForm.FrFormComponent,
    FrForm.FrFormControlComponent,
    FrForm.FrFormGroupComponent,
    FrForm.FrFormControlDirecitveModule
  ],
  templateUrl: './product-inventory-global-delivery.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ProductInventoryGlobalDeliveryComponent extends _AddNewBaseComponent {

  protected get ProductGlobalDeliveryTypeItems(): FrForm.FrInputValueItem<number>[] {
    return [{
      key: this.sanitizer.bypassSecurityTrustHtml(`<span class="mb-1 h6 d-block">${this.productResource.worldwideDelivery}</span><small>${this.productResource.worldwideDeliveryDescription}</small>`),
      value: 1,
      order: 0,
      selectable: true
    },
    {
      key: this.sanitizer.bypassSecurityTrustHtml(`<span class="mb-1 h6 d-block">${this.productResource.localDelivery}</span><small>${this.productResource.localDeliveryDescription}</small>`),
      value: 2,
      order: 1,
      selectable: true
    },
    {
      key: this.sanitizer.bypassSecurityTrustHtml(`<span class="mb-1 h6 d-block">${this.productResource.selectedCountries}</span>`),
      value: 3,
      order: 2,
      selectable: true
    }]
  };

  @ViewChild('productInventoryGlobalDeliveryForm') form!: FrForm.FrFormComponent<ProductGlobalDelivery>;

  @Output() protected validate: EventEmitter<boolean> = new EventEmitter<boolean>();

  private subscription: Subscription;
  protected isGlobalDeliveryCountriesEnable: boolean = false;

  // #region Validators
  protected productGlobalDeliveryCountriesValidators: FrForm.FrFormControlValidator = {
    required: true,
  };
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

          if (this.product && model.isValid && model.data) {
            delete this.product.globalDeliveryCountries;
            this.product.globalDeliveryType = model.data.globalDeliveryType;

            if (model.data.globalDeliveryType === 3) {
              this.product.globalDeliveryCountries = model.data.globalDeliveryCountries;
            }
          }
        }
      });
  }

  protected override async afterViewInit(): Promise<void> {
    setTimeout(() => {
      this.isGlobalDeliveryCountriesEnable = this.product.globalDeliveryType === 3;
    });

    const model: ProductGlobalDelivery = {
      globalDeliveryType: this.product.globalDeliveryType || 1,
      globalDeliveryCountries: this.product.globalDeliveryCountries
    };

    await this.form.setModel(model);
  }

  protected override onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected onSelectGlobalDeliveryType = ($event: FrForm.FrFormControlChangeResult<number, Event>): void => {
    this.isGlobalDeliveryCountriesEnable = ($event.value == 3)
  }
}
