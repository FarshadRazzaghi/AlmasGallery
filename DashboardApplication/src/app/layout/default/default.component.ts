//#region imports
import { DOCUMENT, NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { FrLocalizationService } from '@fr-widget/i18n';
import { FrDisabledDirective } from '@fr-widget/sdk/disabled';
import { FrThemeComponent, FrThemeDefaultThemes, FrThemeNavigationGroup, FrThemeService } from '@fr-theme/common';

import { Resource } from '../../_i18n/resource/resource';
import { HeaderActionButton } from '../../types/button.interface';

import { RoutingService } from '../../services/routing.service';
import { LocalizationService } from '../../services/localization.service';
import { DocumentService } from '../../services/document.service';
import { ErrorHandler, ErrorHandlerService } from '../../services/error-handler.service';

import { AppLogoComponent } from '../../_application/logo/app-logo.component';
import { AppSearchResultComponent } from '../../_application/search-result/app-search-result.component';
import { AppUserDropdownComponent } from '../../_application/user-dropdown/app-user-dropdown.component';
import { AppNotificationDropdownComponent } from '../../_application/notification-dropdown/app-notification-dropdown.component';

import * as FrButton from '@fr-widget/sdk/button';
//#endregion imports

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgComponentOutlet,
    NgTemplateOutlet,
    FrThemeComponent,
    FrDisabledDirective,
    AppLogoComponent,
    AppNotificationDropdownComponent,
    AppSearchResultComponent,
    AppUserDropdownComponent,

    FrButton.FrButtonDirective,
    FrButton.FrButtonIconDirective,
    FrButton.FrButtonWaitingDirective,
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
  protected documentService = inject(DocumentService);
  protected errorHandlerService = inject(ErrorHandlerService);
  protected localizationService = inject(LocalizationService);

  protected themeService = inject(FrThemeService);
  protected themeLocalizationService = inject(FrLocalizationService);

  private _headerbuttons: HeaderActionButton[] = [];
  protected set headerButtons(headerbuttons: HeaderActionButton[]) {
    this._headerbuttons = headerbuttons;
  }
  protected get headerButtons(): HeaderActionButton[] {
    return this._headerbuttons;
  }

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
      });

    this.themeLocalizationService
      .languageChange
      .subscribe(() => {
        this.themeService.initNavigation(this.navigationGroup);
      });

    this.documentService
      .headerButtons
      .subscribe((headerButtons: HeaderActionButton[]) => {
        setTimeout(() => {
          this.headerButtons = headerButtons;
        });
      });
  }

  private loadTheme = (): void => {
    if (typeof window !== "undefined") {
      const themeName: string = FrThemeDefaultThemes.find(x => x.isDark == this.themeService.isDarkMode)?.fileName || '';
      this.themeService.setThemeSchemeMode(this.renderer, this.document.head, themeName);
    }
  }
}
