import { Component, ElementRef, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FrButtonIconDirective } from '@fr-widget/sdk/button';
import { Subscription } from 'rxjs';

import { _ProductUpsertBaseComponent } from '../_product-upsert.base.component';
import { ProductUpsertVariant } from '../../../../types/products/product-upsert.type';

import * as FrForm from '@fr-widget/sdk/form';

@Component({
  selector: 'product-variant',
  standalone: true,
  imports: [
    FrButtonIconDirective,
    FrForm.FrFormComponent,
    FrForm.FrFormControlComponent,
    FrForm.FrFormGroupComponent,
    FrForm.FrFormControlDirecitveModule,
  ],
  templateUrl: './product-variant.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ProductVariantComponent extends _ProductUpsertBaseComponent {

  @ViewChildren(FrForm.FrFormComponent) set forms(forms: QueryList<FrForm.FrFormComponent<ProductUpsertVariant>>) {
    if (forms) {
      this._forms = Array.from(forms);
    }
  }

  //#region productVariants
  private _productVariants: string[] = [];
  protected set productVariants(productVariants: string[]) {
    this._productVariants = productVariants;
  }
  protected get productVariants() {
    return this._productVariants;
  }
  //#endregion productVariants

  private subscription: Subscription;
  private _forms: FrForm.FrFormComponent<ProductUpsertVariant>[] = [];
  protected productVariantOptionValidators: FrForm.FrFormControlValidator = {
    required: true
  };
  protected productVariantValueValidators: FrForm.FrFormControlValidator = {
    required: true
  };

  protected ProductVariantOptionItems: FrForm.FrInputValueItem<number>[] = [{
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
        if (this._forms.length > 0) {
          const variants: ProductUpsertVariant[] = [];
          this._forms.map(async (form, index) => {
            if (form) {
              var model = await form.onSubmit();
              this.productService.addResult(form.id, model.isValid);
              if (model.isValid && model.data) {
                variants.push({
                  option: (<any>model.data)['option' + this.productVariants[index]],
                  value: (<any>model.data)['value' + this.productVariants[index]]
                });
              }
            }
          })

          this.product.variants = variants;
        }
      });
  }

  protected override onInit(): void {
    const variants = this.product.variants || [];
    if (variants.length > 0) {
      variants.map(() => {
        const newName = this.generateRandomName(10);
        this.productVariants.push(newName);
      })
    }
    else {
      const newName = this.generateRandomName(10);
      this.productVariants.push(newName);
    }
  }

  protected override afterViewInit(): void {
    const variants = this.product.variants || [];
    if (variants.length === this._forms.length) {
      this._forms.map(async (form, index) => {
        const option = variants[index].option;
        const value = variants[index].value;
        const formValue: { [key: string]: number | string } = {};

        formValue['option' + this.productVariants[index]] = option;
        formValue['value' + this.productVariants[index]] = value;

        await form.setModel(<ProductUpsertVariant>formValue);
      })
    }
  }

  protected override onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected onRemoveVariant = (item: string): void => {
    const index = this.productVariants.indexOf(item);
    if (index > -1) {
      this.productVariants.splice(index, 1);
    }
  }

  protected onAddNewVariant = (): void => {
    const newName = this.generateRandomName(10);
    for (var i = 0; i < 10; i++) {
      if (!this.productVariants.includes(newName)) {
        this.productVariants.push(newName);
        break;
      }
    }
  }

  private generateRandomName = (length: number): string => {
    let result = '';
    const customAlphabet = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = customAlphabet.length;

    for (let i = 0; i < length; i++) {
      result += customAlphabet.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}
