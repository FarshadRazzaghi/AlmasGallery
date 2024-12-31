import { Component, ElementRef, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { _ProductUpsertBaseComponent } from '../../_product-upsert.base.component';
import { ProductUpsertAdvanced } from '../../../../../types/products/product-upsert.type';

import * as FrForm from '@fr-widget/sdk/form';

@Component({
  selector: 'product-inventory-advanced',
  standalone: true,
  imports: [
    FrForm.FrFormComponent,
    FrForm.FrFormControlComponent,
    FrForm.FrFormGroupComponent,
    FrForm.FrFormControlDirecitveModule
  ],
  templateUrl: './product-inventory-advanced.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ProductInventoryAdvancedComponent extends _ProductUpsertBaseComponent {

  @ViewChild('productInventoryAdvancedForm') form!: FrForm.FrFormComponent<ProductUpsertAdvanced>;

  @Output() protected validate: EventEmitter<boolean> = new EventEmitter<boolean>();

  private subscription: Subscription;
  protected productIdentifierPlaceHolder: string = '';

  // #region Validators
  protected productIdentifierValidators: FrForm.FrFormControlValidator = {
    required: true,
  };
  // #endregion Validators

  protected productIdentifierTypeItems: FrForm.FrInputValueItem<number>[] = [{
    key: 'ISBN',
    value: 1,
    order: 0,
    selectable: true
  },
  {
    key: 'UPC',
    value: 2,
    order: 1,
    selectable: true
  },
  {
    key: 'EAN',
    value: 3,
    order: 2,
    selectable: true
  },
  {
    key: 'JAN',
    value: 4,
    order: 3,
    selectable: true
  }];

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
            this.product.identifierType = model.data.identifierType;
            this.product.identifier = model.data.identifier;
          }
        }
      });
  }

  protected override onInit(): void {
    const selectedItem = this.productIdentifierTypeItems.find(x => x.value === 1);
    if (selectedItem) {
      this.productIdentifierPlaceHolder = this.productResource.identifirePlaceHolder.format([<string>selectedItem.key]);
    }
  }

  protected override async afterViewInit(): Promise<void> {
    const model: ProductUpsertAdvanced = {
      identifierType: this.product.identifierType || 1,
      identifier: this.product.identifier || '',
    };
    await this.form.setModel(model);
  }

  protected override onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected onProductIdentifierTypeChange = ($event: FrForm.FrFormControlChangeResult<number, Event>): void => {
    const selectedItem = this.productIdentifierTypeItems.find(x => x.value === $event.value);
    if (selectedItem) {
      this.productIdentifierPlaceHolder = this.productResource.identifirePlaceHolder.format([<string>selectedItem.key]);
    }
  }
}
