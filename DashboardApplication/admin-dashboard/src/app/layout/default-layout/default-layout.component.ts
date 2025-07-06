import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FrThemeComponent, FrThemeService } from '@fr-theme/common';
import { FrLanguage, FrLocalizationService } from '@fr-widget/i18n';
import { FrDisabledDirective } from '@fr-widget/sdk/disabled';
import { FrButtonWaitingDirective, FrButtonDirective, FrButtonIconDirective } from '@fr-widget/sdk/button';
import { HeaderActionButton, HeaderWaitingButton } from '@core/models';
import { environment } from '@environments/environment';
import * as service from '@core/services';

@Component({
  standalone: true,
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  imports: [
    NgSwitch,
    NgIf,
    NgSwitchCase,
    NgFor,
    RouterOutlet,
    RouterLink,
    FrThemeComponent,
    FrDisabledDirective,
    FrButtonWaitingDirective,
    FrButtonDirective,
    FrButtonIconDirective,
    NgTemplateOutlet,
  ],
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {

  //#region Injected Services
  protected readonly themeService = inject(FrThemeService);
  protected readonly themeLocalizationService = inject(FrLocalizationService);
  protected readonly routingService = inject(service.RoutingService);
  protected readonly localizationService = inject(service.LocalizationService);
  protected readonly documentService = inject(service.DocumentService);
  // #endregion

  // #region Configuration Flags
  private readonly showSearch = false;
  private readonly allowMultiLanguage = false;
  private readonly defaultLanguage: FrLanguage = 'fa';
  // #endregion

  // #region Lifecycle Helpers
  private readonly destroy$ = new Subject<void>();
  // #endregion

  // #region Component Lifecycle
  constructor() {
    this.initializeTheme();
  }

  ngOnInit(): void {
    this.initSearch();
    this.initLanguage();
    this.initHeaderButtons();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // #endregion

  // #region Theme Initialization
  private initializeTheme(): void {
    this.themeService.init({
      showSearch: this.showSearch,
      allowFullScreen: false,
      allowSchemeToggler: false,
      showMobileLogo: false,
      showNotification: false,
      showUserPanel: false,
      showSidebarLogo: false,
      allowMultiSelectNavigation: false,
      localizationConfiguration: {
        allowMultiLanguage: this.allowMultiLanguage,
        defaultLanguage: this.defaultLanguage,
        validLanguages: [this.defaultLanguage],
      },
    });
  }
  // #endregion

  // #region Feature Initialization
  private initSearch(): void {
    if (!this.showSearch) return;

    this.themeService.search
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchedValue: string) => {
        if (searchedValue) {
          setTimeout(() => this.themeService.setSearchFinish(false), 5000);
        }
      });
  }

  private initLanguage(): void {
    if (!this.allowMultiLanguage) {
      this.themeService.initNavigation(this.navigationGroup, environment.dashboard);
      return;
    }

    this.themeLocalizationService.languageChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.themeService.initNavigation(this.navigationGroup, environment.dashboard);
      });
  }

  private initHeaderButtons(): void {
    this.documentService.headerButtons$
      .pipe(takeUntil(this.destroy$))
      .subscribe((buttons: HeaderActionButton[]) => {
        this.headerButtons = buttons;
      });
  }
  // #endregion

  // #region Accessors
  private get navigationGroup() {
    const navigation = this.routingService.navigationGroup;
    navigation.forEach(group => {
      group.items.forEach(item => {
        this.routingService.applyParentRoutePrefix(item);
      });
    });

    return navigation;
  }

  private _headerButtons: HeaderActionButton[] = [];
  protected set headerButtons(buttons: HeaderActionButton[]) {
    this._headerButtons = buttons;
  }
  protected get headerButtons(): HeaderActionButton[] {
    return this._headerButtons;
  }
  // #endregion

  // #region Template Helpers
  protected isWaitingButton = (button: HeaderActionButton): button is HeaderWaitingButton => {
    return button.directive === 'waiting';
  }

  protected trackByIdentifier = (index: number, item: HeaderActionButton): string => {
    return item.identifierName + '-' + (index + 1);
  }
  // #endregion
}
