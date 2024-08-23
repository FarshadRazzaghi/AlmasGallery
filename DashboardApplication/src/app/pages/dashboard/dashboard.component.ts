import { Component, ViewChild, inject } from '@angular/core';
import { Resource } from '../../_i18n/resource/resource';
import { LocalizationService } from '../../services/localization.service';

import * as FrCard from '@fr-widget/sdk/card';
import * as FrDeviceDetector from '@fr-widget/device-detector';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FrCard.FrCardComponent,
    FrCard.FrCardHeaderComponent,
    FrCard.FrCardFooterComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  @ViewChild('testCard') testCard!: FrCard.FrCardComponent;

  protected get resource(): Resource | null {
    return this.localizationService.resource;
  }

  protected localizationService = inject(LocalizationService);
  protected deviceDetectorService = inject(FrDeviceDetector.FrDeviceDetectorService);
}
