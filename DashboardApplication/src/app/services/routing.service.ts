import { Injectable, inject } from '@angular/core';
import { FrThemeNavigationGroup, FrThemeNavigationItem } from '@fr-theme/common';

import { LocalizationService } from './localization.service';
import { RoutingResource } from '../_i18n/resource/resource';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  private localizationService = inject(LocalizationService);

  private navigation: FrThemeNavigationGroup[] = [
    {
      id: 0,
      label: 'navigation',
      visible: true,
      showLabel: true,
      items: [
        {
          id: 0,
          label: 'dashboards',
          icon: 'ri-home-line',
          visible: true,
          enabled: true,
          routeLink: '/dashboard',
        }
      ],
    },
    {
      id: 1,
      label: 'APPS',
      visible: true,
      showLabel: true,
      items: [
        {
          id: 0,
          label: 'products',
          icon: 'ri-box-3-line',
          visible: true,
          enabled: true,
          routeLink: '/products',
          children: [
            {
              id: 1,
              label: 'productsAdd',
              visible: true,
              enabled: true,
              routeLink: '/products/add',
            },
          ]
        },
      ]
    },
  ];

  constructor() { }

  public get navigationGroup(): FrThemeNavigationGroup[] {
    const currrentResource: RoutingResource | undefined = this.localizationService.resource?.routingResource;
    const clonedNavigtion: FrThemeNavigationGroup[] = JSON.parse(JSON.stringify(this.navigation));

    clonedNavigtion.forEach((group: FrThemeNavigationGroup) => {
      const key = group.label;
      if (!currrentResource) {
        group.label = '----';

        this.setAlert(key);
        this.localizeNavigationItemName([], group.items);
        return;
      }

      const objectedRsource = Object.entries(currrentResource);

      const groupLabel = objectedRsource.find(x => x[0] === key);
      if (!groupLabel || !groupLabel[1]) {
        group.label = '----';
        this.setAlert(key);
      }
      else {
        group.label = groupLabel[1];
      }

      this.localizeNavigationItemName(objectedRsource, group.items);
    });

    return clonedNavigtion;
  }

  private localizeNavigationItemName = (objectedRsource: [string, string][], items?: FrThemeNavigationItem[]): void => {
    if (!items) {
      return;
    }

    items.forEach((item: FrThemeNavigationItem) => {
      const key = item.label;
      if (objectedRsource.length === 0) {
        item.label = '----';

        this.setAlert(key);
        this.localizeNavigationItemName(objectedRsource, item.children);
        return;
      }

      const itemLabel = objectedRsource.find(x => x[0] === key);
      if (!itemLabel || !itemLabel[1]) {
        item.label = '----';
        this.setAlert(key);
      }
      else {
        item.label = itemLabel[1];
      }

      this.localizeNavigationItemName(objectedRsource, item.children);
    });
  }

  private setAlert = (key: string) => {
    console.warn(`${this.localizationService.currentLanguage.language}.${key}`);
  }
}
