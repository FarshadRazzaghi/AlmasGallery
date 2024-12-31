import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { _ProductUpsertBaseComponent } from '../_product-upsert.base.component';
import { ProductUpsertInformation } from '../../../../types/products/product-upsert.type';

import * as FrForm from '@fr-widget/sdk/form';

@Component({
  selector: 'product-information',
  standalone: true,
  imports: [
    FrForm.FrFormComponent,
    FrForm.FrFormControlComponent,
    FrForm.FrFormControlDirecitveModule,
  ],
  templateUrl: './product-information.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ProductInformationComponent extends _ProductUpsertBaseComponent {

  @ViewChild('productInformationForm') form!: FrForm.FrFormComponent<ProductUpsertInformation>;

  private subscription: Subscription;

  // #region Validators
  protected productNameValidators: FrForm.FrFormControlValidator = {
    required: true,
    minLength: 5
  };
  protected productSKUValidators: FrForm.FrFormControlValidator = {
    required: false,
  };
  protected productBarCodeValidators: FrForm.FrFormControlValidator = {
    required: false,
  };
  protected productDescriptionValidators: FrForm.FrFormControlValidator = {
    required: true,
  };
  // #endregion Validators

  protected productDescriptionToolbarOptions: FrForm.FrEditorToolbar = {
    textFormat: {
      bold: true,
      italic: true,
      underLine: true,
      strikeLine: true,
    },
    listFormat: {
      bulletOrder: true,
      numberOrder: true,
    },
    multimediFormat: {
      image: true,
      link: true,
    },
    cleanFormat: true,
  };

  constructor(elementRef: ElementRef) {
    super(elementRef);

    this.subscription = this.productService
      .formValidation
      .subscribe(async () => {
        if (this.form) {
          var model = await this.form.onSubmit();
          this.productService.addResult(this.form.id, model.isValid);

          if (model.isValid && model.data) {
            this.product.name = model.data.name;
            this.product.sku = model.data.sku;
            this.product.barCode = model.data.barCode;
            this.product.description = model.data.description;
          }
        }
      });
  }

  protected override async afterViewInit(): Promise<void> {
    const model: ProductUpsertInformation = {
      name: this.product.name || '',
      description: this.product.description || '',
      barCode: this.product.barCode,
      sku: this.product.sku,
    };
    await this.form.setModel(model);
  }

  protected override onDestroy(): void {
    this.subscription.unsubscribe();
  }
}
