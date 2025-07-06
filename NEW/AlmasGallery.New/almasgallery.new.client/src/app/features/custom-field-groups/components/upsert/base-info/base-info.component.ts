import { Component, ViewChild } from '@angular/core';

import { CustomFieldGroupEntityType } from '@core/generated';
import { CustomFieldGroupResource } from '@core/models';
import { BaseFormComponentDirective } from '@shared/components';

import {
  FrFormComponent,
  FrFormControlComponent,
  FrFormControlDirectiveModule,
  FrInputValueItem
} from '@fr-widget/sdk/form';

import { CustomFieldGroupBaseInfo } from '../../../models/custom-field-group.model';

@Component({
  standalone: true,
  selector: 'app-cfg-upsert-base-info',
  templateUrl: './base-info.component.html',
  imports: [
    FrFormComponent,
    FrFormControlComponent,
    FrFormControlDirectiveModule
  ],
})
export class BaseInfoComponent extends BaseFormComponentDirective<CustomFieldGroupBaseInfo | undefined> {

  @ViewChild('baseInfoForm', { static: false })
  form!: FrFormComponent<CustomFieldGroupBaseInfo>;

  //#region State
  private afterViewInitDone!: Promise<void>;
  private afterViewInitResolver!: () => void;

  protected customFieldGroupEntityTypes: FrInputValueItem<CustomFieldGroupEntityType>[] = [];
  //#endregion

  //#region Lifecycle Hooks
  protected override async afterViewInit(): Promise<void> {
    this.afterViewInitDone = new Promise<void>((resolve) => {
      this.afterViewInitResolver = resolve;
    });

    setTimeout(() => {
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
      entityType: (formResult.data.entityType ?? 1) as CustomFieldGroupEntityType,
    } as CustomFieldGroupBaseInfo);
  }

  protected override async onSetModel(model: CustomFieldGroupBaseInfo | undefined): Promise<void> {
    if (this.afterViewInitDone) {
      await this.afterViewInitDone;
    }

    this.customFieldGroupEntityTypes = this.loadCustomFieldGroupEntityTypes();

    if (!model) {
      return;
    }

    if (this.form) {
      this.form.setModel({
        name: model.name,
        entityType: model.entityType,
      } as CustomFieldGroupBaseInfo);
    }
  }

  protected override async onResetModel(): Promise<void> {
    await this.form.onReset();
  }
  //#endregion

  //#region Private Methods
  private loadCustomFieldGroupEntityTypes(): FrInputValueItem<CustomFieldGroupEntityType>[] {
    const customFieldGroupEntityTypeResource = this.applicationLocalizationService.resource.enumResource.customFieldGroupType;
    return [
      {
        key: customFieldGroupEntityTypeResource.product,
        value: 1,
        order: 1,
        selectable: true,
      }
    ];
  }
  //#endregion

  //#region Accessors
  protected get customFieldGroupResource(): CustomFieldGroupResource {
    return this.applicationLocalizationService.resource.customFieldGroupResource;
  }
  //#endregion
}
