import { Injectable, inject } from '@angular/core';
import { FrLanguage, FrLocalization, FrLocalizationService } from '@fr-widget/i18n';
import { FrLocalizationConfiguration } from '@fr-theme/common';

import { ApplicationLanguage } from '../helper/inner.types';

import { Resource } from '../_i18n/resource/resource';
import { GermanResource, ThemeGermanResource } from '../_i18n/resource/german.resource';
import { EnglishResource } from '../_i18n/resource/english.resource';
import { PersianResource } from '../_i18n/resource/persian.resource';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  private german: ApplicationLanguage = 'de';

  private languageResource: { language: ApplicationLanguage, resource: Resource }[] = [
    { language: 'de', resource: new GermanResource },
    { language: 'en', resource: new EnglishResource },
    { language: 'fa', resource: new PersianResource },
  ];

  private localizationService = inject(FrLocalizationService);

  constructor() { }

  public get validLanguages(): ApplicationLanguage[] {
    return [this.german, 'fa', 'en'];
  }

  public init = () => {
    const germanLanguage: FrLocalization = {
      calendarType: 'gregorian',
      currencySign: '€',
      currency: 'euro',
      direction: 'ltr',
      language: <FrLanguage>this.german,
      name: 'Deutsche',
      resource: ThemeGermanResource,
    }

    this.localizationService.addNewLocalization(germanLanguage);
  }

  public get themeConfiguration(): FrLocalizationConfiguration {
    return {
      allowMultiLanguage: true,
      defaultLanguage: <FrLanguage>this.german,
      validLanguages: <FrLanguage[]>this.validLanguages,
    };
  }

  public get resource(): Resource | null {
    const localizationLanguage = this.localizationService.currentLocalization;
    const language = this.languageResource.find(lr => lr.language == localizationLanguage.language);
    if (!language) return null;

    return language.resource;
  }

  public get currentLanguage(): FrLocalization {
    return this.localizationService.currentLocalization;
  }
}
