import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { _AddNewBaseComponent } from '../_add-new.base.component';
import { ProductImage } from '../../../../types/products/product.type';

import * as FrForm from '@fr-widget/sdk/form';

@Component({
  selector: 'product-image',
  standalone: true,
  imports: [
    FrForm.FrFormComponent,
    FrForm.FrFormControlComponent,
    FrForm.FrFormControlDirecitveModule,
  ],
  templateUrl: './product-image.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ProductImageComponent extends _AddNewBaseComponent {

  @ViewChild('productImageForm') form!: FrForm.FrFormComponent<ProductImage>;

  private subscription: Subscription;

  // #region Validators
  protected productImageValidators: FrForm.FrFormControlValidator = {}
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
            this.product.image = model.data.image;
          }
        }
      });
  }

  protected override async afterViewInit(): Promise<void> {
    const model: ProductImage = {
      image: this.product.image
    };
    await this.form.setModel(model);
  }

  protected override onDestroy(): void {
    this.subscription.unsubscribe();
  }
}
