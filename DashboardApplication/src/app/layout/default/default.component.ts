import { DOCUMENT, NgComponentOutlet } from '@angular/common';
import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { FrThemeComponent, FrThemeDefaultThemes, FrThemeNavigationGroup, FrThemeService } from '@fr-theme/common';
import { FrLocalizationService } from '@fr-widget/i18n';

import { Resource } from '../../_i18n/resource/resource';
import { RoutingService } from '../../services/routing.service';
import { ErrorHandler, ErrorHandlerService } from '../../services/error-handler.service';
import { LocalizationService } from '../../services/localization.service';
import { RouterOutlet } from '@angular/router';

import { AppLogoComponent } from '../../_application/logo/app-logo.component';
import { AppNotificationDropdownComponent } from '../../_application/notification-dropdown/app-notification-dropdown.component';
import { AppSearchResultComponent } from '../../_application/search-result/app-search-result.component';
import { AppUserDropdownComponent } from '../../_application/user-dropdown/app-user-dropdown.component';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [
    RouterOutlet,
    NgComponentOutlet,
    FrThemeComponent,
    AppLogoComponent,
    AppNotificationDropdownComponent,
    AppSearchResultComponent,
    AppUserDropdownComponent
  ],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss'
})
export class DefaultComponent implements OnInit {
  protected get errorModal(): ErrorHandler {
    return this.errorHandlerService.getError;
  }

  protected get resource(): Resource | null {
    return this.localizationService.resource;
  }

  protected get isSidebarCollapsed(): boolean {
    return this.themeService.isSidebarCollapsed;
  }

  private get navigationGroup(): FrThemeNavigationGroup[] {
    return this.routingService.navigationGroup;
  }

  protected document = inject(DOCUMENT);
  protected renderer = inject(Renderer2);
  protected routingService = inject(RoutingService);
  protected errorHandlerService = inject(ErrorHandlerService);
  protected localizationService = inject(LocalizationService);

  protected themeService = inject(FrThemeService);
  protected themeLocalizationService = inject(FrLocalizationService);

  ngOnInit(): void {
    this.loadTheme();

    this.themeService
      .search
      .subscribe((searchedValue: string) => {
        if (searchedValue) {

          setTimeout(() => {
            this.themeService.setSearchFinish(false);
          }, 5000);
        }
      })

    this.themeLocalizationService
      .languageChange
      .subscribe(() => {
        this.themeService.initNavigation(this.navigationGroup);
      })
  }

  private loadTheme = (): void => {
    if (typeof window !== "undefined") {
      const themeName: string = FrThemeDefaultThemes.find(x => x.isDark == this.themeService.isDarkMode)?.fileName || '';
      this.themeService.setThemeSchemeMode(this.renderer, this.document.head, themeName);
    }
  }
}
