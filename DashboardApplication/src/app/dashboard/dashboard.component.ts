import { Component, ViewChild, inject } from '@angular/core';

import { Resource } from '../_i18n/resource/resource';
import { LocalizationService } from '../services/localization.service';

import * as FrCard from '@fr-widget/sdk/card';
import * as FrForm from '@fr-widget/sdk/form';
import * as FrDeviceDetector from '@fr-widget/device-detector';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FrForm.FrFormComponent,
    FrForm.FrFormControlComponent,
    FrForm.FrFormControlDirecitveModule,

    FrCard.FrCardComponent,
    FrCard.FrCardHeaderComponent,
    FrCard.FrCardFooterComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  @ViewChild('testCard') testCard!: FrCard.FrCardComponent;

  protected get resource(): Resource | null {
    return this.localizationService.resource;
  }

  protected get firstNameValidators(): FrForm.FrFormControlValidator {
    return {
      min: 5,
      max: 100,
    }
  }

  protected get getRadioClass(): string[] {
    if (this.deviceDetectorService.accessibleViewPorts([FrDeviceDetector.FrDeviceViewPorts.sm, FrDeviceDetector.FrDeviceViewPorts.md])) {
      return ['my-3'];
    } else {
      return ['mx-3'];
    }
  }

  protected get selectOneRadioItems(): FrForm.FrInputValueItem<boolean>[] {
    return [
      {
        order: 1,
        key: 'HELLO',
        selectable: true,
        value: false
      },
      {
        order: 2,
        key: 'HELLO_2',
        selectable: true,
        value: true
      }
    ];
  }

  protected isTextboxEnabled: boolean = true;

  protected localizationService = inject(LocalizationService);
  protected deviceDetectorService = inject(FrDeviceDetector.FrDeviceDetectorService);

  protected onCardDelete = ($event: FrCard.FrCardDeleteEvent): void => { }

  protected onCardUpdate = ($event: FrCard.FrCardUpdateEvent): void => {
    setTimeout(() => {
      this.testCard.doneUpdate();
    }, 5000);
  }

  protected onToggleTextBox = (): void => {
    this.isTextboxEnabled = !this.isTextboxEnabled;
  }

  protected onFirstNameChange = ($event: FrForm.FrFormControlTextBoxChangeResult): void => {
    //console.log($event);
  }

  protected onLastNameChange = ($event: FrForm.FrFormControlCheckBoxChangeResult): void => {
    //console.log($event);
  }

  protected onHelloWorldClick = ($event: Event): void => {
    //console.log($event);
  }

  protected onSelectOnChanged = ($event: FrForm.FrFormControlRadioChangeResult<boolean>): void => {
    console.log($event);
  }
}
