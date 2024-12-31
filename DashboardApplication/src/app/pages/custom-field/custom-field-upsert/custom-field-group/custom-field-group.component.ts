import { Component, ElementRef, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { _CustomFieldUpsertBaseComponent } from '../_custom-field-upsert.base.component';
import { CustomFieldUpsertGroup } from '../../../../types/custom-field/custom-field-upsert.type';
import { EnumListRequest } from '../../../../types/shared/shared.type';

import * as FrForm from '@fr-widget/sdk/form';

@Component({
  selector: 'custom-field-group',
  standalone: true,
  imports: [
    FrForm.FrFormComponent,
    FrForm.FrFormControlComponent,
    FrForm.FrFormControlDirectiveModule,
  ],
  templateUrl: './custom-field-group.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CustomFieldGroupComponent extends _CustomFieldUpsertBaseComponent {

  @ViewChild('customFieldGroupForm') form!: FrForm.FrFormComponent<CustomFieldUpsertGroup>;

  // #region Fields
  private subscription: Subscription;
  private resetSubscription: Subscription;
  // #endregion Fields

  // #region Validators
  protected customFieldGroupValidators: FrForm.FrFormControlValidator = {
    required: true
  }
  protected customFieldGroupTypeValidators: FrForm.FrFormControlValidator = {
    required: true
  }
  // #endregion Validators

  constructor(elementRef: ElementRef) {
    super(elementRef);

    this.subscription = this.applicationDocumentService
      .formValidation
      .subscribe(async () => {
        if (this.form) {
          var model = await this.form.onSubmit();
          this.applicationDocumentService.addResult(this.form.id, model.isValid);

          if (model.isValid && model.data) {
            this.customField.groupName = model.data.groupName;
            this.customField.groupType = model.data.groupType;
          }
        }
      })

    this.resetSubscription = this.customFieldService
      .customFieldReset
      .subscribe(option => {
        if (this.form && option) {
          setTimeout(async () => {
            await this.onReset();
          })
        }
      })
  }

  protected override async afterViewInit(): Promise<void> {
    const model: CustomFieldUpsertGroup = {
      groupName: this.customField.groupName,
      groupType: this.customField.groupType,
    };

    await this.form.setModel(model);

    setTimeout(async () => {
      var items = await this.getCustomFieldGroupTypes()
      var parentCustomField = this.form.formControls['groupType'];
      Object.defineProperties(parentCustomField, {
        items: {
          get: () => {
            return items.map((x, i) => {
              const splittedName = (items.find(i => x.value == i.value)?.name ?? '').split('.');
              return {
                key: (<any>this.applicationResource.enumResources)[splittedName[0]][splittedName[1]],
                value: x.value,
                order: i,
                selectable: true,
              } as FrForm.FrInputValueItem<number>;
            });
          }
        },
      });
    })
  }

  protected override onDestroy(): void {
    this.subscription.unsubscribe();
    this.resetSubscription.unsubscribe();
  }

  // #region Private Methods
  private getCustomFieldGroupTypes = async (): Promise<EnumListRequest<number>[]> => {
    var items = await this.customFieldService.httpService.getTypeList();

    if (items.status) {
      return items.data ?? [];
    }

    return [];
  }

  private onReset = async (): Promise<void> => {
    await this.form.onReset();
  }
  // #endregion Private Methods
}
