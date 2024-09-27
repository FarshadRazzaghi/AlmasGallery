import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { _AddNewBaseComponent } from '../_add-new.base.component';
import { ProductOrganize } from '../../../../types/products/product.type';

import * as FrForm from '@fr-widget/sdk/form';

@Component({
  selector: 'product-organize',
  standalone: true,
  imports: [
    FrForm.FrFormComponent,
    FrForm.FrFormControlComponent,
    FrForm.FrFormGroupComponent,
    FrForm.FrFormControlDirecitveModule,
  ],
  templateUrl: './product-organize.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ProductOrganizeComponent extends _AddNewBaseComponent {

  @ViewChild('productOrganizationForm') form!: FrForm.FrFormComponent<ProductOrganize>;

  private subscription: Subscription;

  // #region Validators
  protected productVendorValidators: FrForm.FrFormControlValidator = {
    required: true,
  };
  protected productCategoryValidators: FrForm.FrFormControlValidator = {
    required: true,
  };
  protected productCollectionValidators: FrForm.FrFormControlValidator = {};
  protected productPublishStatusValidators: FrForm.FrFormControlValidator = {
    required: true,
  };
  protected productTagsValidators: FrForm.FrFormControlValidator = {
    required: true
  };

  // #endregion Validators


  protected ProductCategoryItems: FrForm.FrInputValueItem<number>[] = [{
    key: 'Category 1',
    value: 1,
    order: 0,
    selectable: true
  },
  {
    key: 'Category 2',
    value: 2,
    order: 1,
    selectable: true
  },
  {
    key: 'Category 3',
    value: 3,
    order: 2,
    selectable: true
  },
  {
    key: 'Category 4',
    value: 4,
    order: 3,
    selectable: true
  }];
  protected ProductVendorItems: FrForm.FrInputValueItem<number>[] = [{
    key: 'Vendor 1',
    value: 1,
    order: 0,
    selectable: true
  },
  {
    key: 'Vendor 2',
    value: 2,
    order: 1,
    selectable: true
  },
  {
    key: 'Vendor 3',
    value: 3,
    order: 2,
    selectable: true
  },
  {
    key: 'Vendor 4',
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

          if (model.isValid && model.data) {
            this.product.vendorId = model.data.vendorId;
            this.product.categoryId = model.data.categoryId;
            this.product.collectionId = model.data.collectionId;
            this.product.tags = model.data.tags;
          }
        }
      });
  }

  protected override async afterViewInit(): Promise<void> {
    const model: ProductOrganize = {
      tags: this.product.tags || [],
      categoryId: this.product.categoryId || 1,
      vendorId: this.product.vendorId || 1,
      collectionId: this.product.collectionId,
    };
    await this.form.setModel(model);
  }

  protected override onDestroy(): void {
    this.subscription.unsubscribe();
  }
}
