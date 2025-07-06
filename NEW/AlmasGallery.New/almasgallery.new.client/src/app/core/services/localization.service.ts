import { inject, Injectable } from '@angular/core';
import { FrLocalizationConfiguration } from '@fr-theme/common';
import { FrLanguage, FrLocalization, FrLocalizationService } from '@fr-widget/i18n';
import * as models from '@core/models';

@Injectable({ providedIn: 'root' })
export class LocalizationService {

  private readonly localizationService = inject(FrLocalizationService);

  private readonly languageResourceMap = new Map<models.ApplicationLanguage, models.Resource>([
    ['en', new models.EnglishResource()],
    ['fa', new models.PersianResource()],
  ]);

  public get validLanguages(): models.ApplicationLanguage[] {
    return Array.from(this.languageResourceMap.keys());
  }

  public get themeConfiguration(): FrLocalizationConfiguration {
    return {
      allowMultiLanguage: true,
      defaultLanguage: 'fa',
      validLanguages: this.validLanguages as FrLanguage[],
    };
  }

  public get resource(): models.Resource {
    const localizationLanguage = this.localizationService.currentLocalization.language;
    return this.languageResourceMap.get(localizationLanguage) ?? new models.PersianResource();
  }

  public get currentLanguage(): FrLocalization {
    return this.localizationService.currentLocalization;
  }

  public get isRTL(): boolean {
    return this.currentLanguage.direction === 'rtl';
  }
}
