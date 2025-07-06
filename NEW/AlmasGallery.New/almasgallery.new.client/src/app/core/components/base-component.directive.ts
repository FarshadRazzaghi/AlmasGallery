import { Directive, ElementRef, inject, OnDestroy, SimpleChanges } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

import { environment } from '@environments/environment';

import { FrThemeService } from '@fr-theme/common';
import { FrLocalizationService } from '@fr-widget/i18n';
import { FrBaseComponent } from '@fr-widget/sdk';

import { AuthType, HttpAuthService } from '@core/generated';
import { Resource } from '@core/models';
import { DocumentService, LocalizationService, RoutingService } from '@core/services';
import { NavigationRoute } from '@core/config';

@Directive()
export abstract class BaseComponentDirective extends FrBaseComponent implements OnDestroy {

  // #region Injected Services
  protected readonly themeService = inject(FrThemeService);
  protected readonly routingService = inject(RoutingService);
  protected readonly applicationLocalizationService = inject(LocalizationService);
  protected readonly frI18NService = inject(FrLocalizationService);
  protected readonly httpAuthService = inject(HttpAuthService);
  protected readonly documentService = inject(DocumentService);
  // #endregion

  // #region State
  protected notFoundRoute: string = `${NavigationRoute['dashboard']}/${NavigationRoute['notFound']}`;
  protected changingLanguage = false;
  // #endregion

  // #region Lifecycle Helpers
  protected readonly destroy$ = new Subject<void>();
  // #endregion

  // #region Lifecycle Hooks
  constructor(elementRef: ElementRef, router: Router) {
    super(elementRef);
    router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(event => event instanceof NavigationStart)
      )
      .subscribe(() => this.documentService.clearButtons());

    this.initializeAuthConfig();
  }

  protected override onInit(): void {
    this.subscribeToLanguageChange();
  }

  protected override onChanges(_changes: SimpleChanges): void { }

  protected override doCheck(): void { }

  protected override afterContentInit(): void { }

  protected override afterContentChecked(): void { }

  protected override afterViewInit(): void { }

  protected override afterViewChecked(): void { }

  protected override onDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected override onLanguageChange(): void { }

  protected override onResize(): void { }
  // #endregion

  // #region Language Handling
  private subscribeToLanguageChange(): void {
    this.frI18NService.languageChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.changingLanguage = true;

        setTimeout(() => {
          this.onLanguageChange();
          this.changingLanguage = false;
        })
      });
  }
  // #endregion

  // #region Auth
  private initializeAuthConfig(): void {
    const { username, password } = environment.auth;

    if (!username || !password) {
      throw new Error('[BaseComponent] Missing authentication credentials. Please check environment config.');
    }

    this.httpAuthService.setAuthConfig({
      type: AuthType.Basic,
      credentials: `${username}:${password}`,
    });
  }
  // #endregion

  // #region Accessors
  protected get applicationResource(): Resource {
    return this.applicationLocalizationService.resource;
  }
  // #endregion
}
