import { Injectable, inject } from '@angular/core';
import { FrLanguage, FrLocalization, FrLocalizationService } from '@fr-widget/i18n';
import { FrLocalizationConfiguration } from '@fr-theme/common';

import { ApplicationLanguage } from '../helper/inner.types';

import { Resource } from '../_i18n/resource/resource';
import { EnglishResource } from '../_i18n/resource/english.resource';
import { PersianResource } from '../_i18n/resource/persian.resource';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  private languageResource: { language: ApplicationLanguage, resource: Resource }[] = [
    { language: 'en', resource: new EnglishResource },
    { language: 'fa', resource: new PersianResource },
  ];

  private localizationService = inject(FrLocalizationService);

  constructor() { }

  public get validLanguages(): ApplicationLanguage[] {
    return ['fa', 'en'];
  }

  public init = () => { }

  public get themeConfiguration(): FrLocalizationConfiguration {
    return {
      allowMultiLanguage: true,
      defaultLanguage: 'fa',
      validLanguages: <FrLanguage[]>this.validLanguages,
    };
  }

  public get resource(): Resource {
    const localizationLanguage = this.localizationService.currentLocalization;
    const language = this.languageResource.find(lr => lr.language == localizationLanguage.language);
    if (!language) {
      return new EnglishResource;
    }

    return language.resource;
  }

  public get currentLanguage(): FrLocalization {
    return this.localizationService.currentLocalization;
  }

  public get isRTL(): boolean {
    return this.currentLanguage.direction === 'rtl';
  }
}
