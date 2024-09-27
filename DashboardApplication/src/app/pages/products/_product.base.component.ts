import { Component, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
import { _BaseComponent } from '../_base.component';

import { ProductService } from './product.service';
import { ProductResource, Resource } from '../../_i18n/resource/resource';

@Component({
  selector: 'product-base',
  standalone: true,
  imports: [],
  template: '',
  encapsulation: ViewEncapsulation.None,
})
export abstract class _ProductBaseComponent extends _BaseComponent {
  protected get productResource(): ProductResource {
    return this.applicationLocalizationService.resource.productResource;
  }
}
