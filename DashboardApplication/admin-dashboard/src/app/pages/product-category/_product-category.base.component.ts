import { Component, ViewEncapsulation } from '@angular/core';
import { _BaseComponent } from '../_base.component';

import { ProductCategoryResource } from '../../_i18n/resource/resource';

@Component({
  selector: 'product-category-base',
  standalone: true,
  imports: [],
  template: '',
  encapsulation: ViewEncapsulation.None,
})
export abstract class _ProductCategoryBaseComponent extends _BaseComponent {
  protected get productCategoryResource(): ProductCategoryResource {
    return this.applicationLocalizationService.resource.productCategoryResource;
  }
}
