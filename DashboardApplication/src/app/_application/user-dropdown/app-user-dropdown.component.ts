import { Component, ViewEncapsulation, inject } from '@angular/core';
import { NgClass } from '@angular/common';

import { FrThemeComponent, FrThemeService } from '@fr-theme/common';

import { FrLocalizationService, FrLocalization, FrDirection } from '@fr-widget/i18n';
import { FrDeviceViewPorts, FrDeviceDetectorService } from '@fr-widget/device-detector';
import { FrDropdownDirective } from '@fr-widget/sdk/dropdown';

@Component({
  standalone: true,
  selector: 'app-user-dropdown',
  templateUrl: './app-user-dropdown.component.html',
  imports: [NgClass, FrThemeComponent, FrDropdownDirective],
  encapsulation: ViewEncapsulation.None,
})
export class AppUserDropdownComponent {

  protected get viewPorts(): typeof FrDeviceViewPorts {
    return FrDeviceViewPorts;
  }

  protected get currentLocalization(): FrLocalization {
    return this.localizationService.currentLocalization;
  }

  protected get direction(): FrDirection {
    return this.currentLocalization.direction;
  }

  protected themeService = inject(FrThemeService);
  protected localizationService = inject(FrLocalizationService);

  constructor(private deviceService: FrDeviceDetectorService) { }

  protected displayViewPorts = (viewPorts: FrDeviceViewPorts[]) => {
    return this.deviceService.accessibleViewPorts(viewPorts);
  }
}
