import { Component, ViewEncapsulation, inject } from '@angular/core';
import { _BaseComponent } from '../_base.component';

import { CustomFieldResource } from '../../_i18n/resource/resource';

@Component({
  selector: 'custom-field-base',
  standalone: true,
  imports: [],
  template: '',
  encapsulation: ViewEncapsulation.None,
})
export abstract class _CustomFieldBaseComponent extends _BaseComponent {

  protected get dataTypeResource(): { key: string, value: number }[] {
    return [
      {
        key: this.customFieldResource.numberDataType,
        value: 1,
      },
      {
        key: this.customFieldResource.stringDataType,
        value: 2,
      },
      {
        key: this.customFieldResource.dateDataType,
        value: 3,
      },
      {
        key: this.customFieldResource.booleanDataType,
        value: 4,
      }
    ]
  }

  protected get customFieldResource(): CustomFieldResource {
    return this.applicationLocalizationService.resource.customFieldResource;
  }
}
