import { Component, ViewEncapsulation } from '@angular/core';
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

  protected get customFieldResource(): CustomFieldResource {
    return this.applicationLocalizationService.resource.customFieldResource;
  }
}
