import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';

import { FrThemeService } from '@fr-theme/common';
import { FrLocalizationService } from '@fr-widget/i18n';

import { LocalizationService } from './services/localization.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, NgComponentOutlet],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  protected themeService = inject(FrThemeService);
  protected themeLocalizationService = inject(FrLocalizationService);

  protected localizationService = inject(LocalizationService);

  protected title: string = 'Almas Gallery';

  constructor() {
    this.localizationService.init();

    this.themeService.init({
      allowFullScreen: true,
      allowSchemeToggler: true,
      showMobileLogo: true,
      showNotification: true,
      showSearch: true,
      showSidebarLogo: true,
      showUserPanel: true,
      allowMultiSelectNavigation: false,
      localizationConfiguration: this.localizationService.themeConfiguration
    });
  }

  ngOnInit(): void { }
}
