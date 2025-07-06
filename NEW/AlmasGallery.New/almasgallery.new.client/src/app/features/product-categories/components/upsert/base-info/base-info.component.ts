import { Component, inject, ViewChild } from '@angular/core';

import { ProductCategoryResource } from '@core/models';
import { BaseFormComponentDirective } from '@shared/components';

import {
  FrEditorToolbar,
  FrFormComponent,
  FrFormControlComponent,
  FrFormControlDirectiveModule,
  FrFormGroupComponent,
  FrInputValueItem
} from '@fr-widget/sdk/form';

import { ProductCategoryBaseInfo } from '../../../models/product-category.model';
import { ProductCategoryService } from '../../../services/product-category.service';

@Component({
  standalone: true,
  selector: 'app-pc-upsert-base-info',
  templateUrl: './base-info.component.html',
  imports: [
    FrFormComponent,
    FrFormControlComponent,
    FrFormGroupComponent,
    FrFormControlDirectiveModule
  ],
})
export class BaseInfoComponent extends BaseFormComponentDirective<ProductCategoryBaseInfo | undefined> {

  @ViewChild('baseInfoForm', { static: false })
  form!: FrFormComponent<ProductCategoryBaseInfo>;

  //#region Injected Services
  protected readonly productCategoryService = inject(ProductCategoryService);
  //#endregion

  //#region State
  private afterViewInitDone!: Promise<void>;
  private afterViewInitResolver!: () => void;

  protected readonly descriptionToolbarOptions: FrEditorToolbar = {
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
    cleanFormat: true,
  };

  protected parentItems: FrInputValueItem<number>[] = [];
  //#endregion

  //#region Lifecycle Hooks
  protected override async afterViewInit(): Promise<void> {
    this.afterViewInitDone = new Promise<void>((resolve) => {
      this.afterViewInitResolver = resolve;
    });

    setTimeout(async () => {
      this.afterViewInitResolver();
    })
  }

  protected override async onSubmitForm(): Promise<void> {
    const formResult = await this.form.onSubmit();
    if (!formResult.isValid || !formResult.data) {
      this.formHandlerService.submitResult(this.id, false);
      return;
    };

    this.formHandlerService.submitResult(this.id, formResult.isValid, {
      name: formResult.data.name ?? '',
      parentId: formResult.data.parentId,
      description: formResult.data.description ?? '',
    } as ProductCategoryBaseInfo);
  }

  protected override async onSetModel(model: ProductCategoryBaseInfo | undefined): Promise<void> {
    if (this.afterViewInitDone) {
      await this.afterViewInitDone;
    }

    this.parentItems = await this.productCategoryService.getProductCategoryItems(model?.id);

    if (!model) {
      return;
    }

    if (this.form) {
      this.form.setModel({
        name: model.name,
        parentId: model.parentId,
        description: model.description,
      } as ProductCategoryBaseInfo);
    }
  }

  protected override async onResetModel(): Promise<void> {
    await this.form.onReset();
  }
  //#endregion

  //#region Accessors
  protected get productCategoryResource(): ProductCategoryResource {
    return this.applicationLocalizationService.resource.productCategoryResource;
  }
  //#endregion
}
