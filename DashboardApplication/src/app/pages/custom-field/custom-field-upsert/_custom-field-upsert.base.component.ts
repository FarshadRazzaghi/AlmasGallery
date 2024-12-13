import { Component, ViewEncapsulation, inject } from '@angular/core';

import { _CustomFieldBaseComponent } from '../_custom-field.base.component';

import { CustomFieldUpsert } from '../../../types/custom-fields/custom-field-upsert.type';
import { CustomFieldService } from '../custom-field.service';

@Component({
  selector: 'custom-field-upsert-base',
  standalone: true,
  imports: [],
  template: '',
  encapsulation: ViewEncapsulation.None,
})
export abstract class _CustomFieldUpsertBaseComponent extends _CustomFieldBaseComponent {

  //#region customField
  protected set customField(customField: CustomFieldUpsert) {
    this.customFieldService.customField = customField;
  }
  protected get customField(): CustomFieldUpsert {
    return this.customFieldService.customField;
  }
  //#endregion customField

  protected customFieldService: CustomFieldService = inject(CustomFieldService);
}
