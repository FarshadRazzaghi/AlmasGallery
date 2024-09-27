import { Component, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
import { FrBaseComponent } from '@fr-widget/sdk';

import { LocalizationService } from '../services/localization.service';
import { Resource } from '../_i18n/resource/resource';

@Component({
  selector: 'base',
  standalone: true,
  imports: [],
  template: '',
  encapsulation: ViewEncapsulation.None,
})
export abstract class _BaseComponent extends FrBaseComponent {

  protected get appplicationResource(): Resource {
    return this.applicationLocalizationService.resource;
  }

  protected applicationLocalizationService: LocalizationService = inject(LocalizationService);

  protected override onChanges(changes: SimpleChanges): void {
    if (changes) {
      // throw new Error('Method not implemented.');
    }
  }

  protected override onInit(): void {
    // throw new Error('Method not implemented.');
  }

  protected override doCheck(): void {
    // throw new Error('Method not implemented.');
  }

  protected override afterContentInit(): void {
    // throw new Error('Method not implemented.');
  }

  protected override afterContentChecked(): void {
    // throw new Error('Method not implemented.');
  }

  protected override afterViewInit(): void {
    // throw new Error('Method not implemented.');
  }

  protected override afterViewChecked(): void {
    // throw new Error('Method not implemented.');
  }

  protected override onDestroy(): void {
    // throw new Error('Method not implemented.');
  }

  protected override onResize(): void {
    //throw new Error('Method not implemented.');
  }
}
