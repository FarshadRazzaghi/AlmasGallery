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
      showLabel: false,
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
      label: 'settings',
      visible: true,
      showLabel: true,
      items: [
        {
          id: 0,
          label: 'customFields',
          icon: 'ri-list-settings-line',
          visible: true,
          enabled: true,
          routeLink: '/custom-fields',
        },
      ]
    },
    {
      id: 2,
      label: 'products',
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
              label: 'productsList',
              visible: true,
              enabled: true,
              routeLink: '/products'
            },
            {
              id: 2,
              label: 'productsAdd',
              visible: true,
              enabled: true,
              routeLink: '/products/add',
            },
          ]
        },
        {
          id: 1,
          label: 'productCategories',
          icon: 'ri-layout-grid-line',
          visible: true,
          enabled: true,
          routeLink: '/product-categories',
          children: [
            {
              id: 1,
              label: 'productCategoriesList',
              visible: true,
              enabled: true,
              routeLink: '/product-categories'
            },
            {
              id: 2,
              label: 'productCategoriesAdd',
              visible: true,
              enabled: true,
              routeLink: '/product-categories/add',
            },
          ]
        }
      ]
    },
  ];

  public get navigationGroup(): FrThemeNavigationGroup[] {
    const currentResource: RoutingResource | undefined = this.localizationService.resource?.routingResource;
    const clonedNavigation: FrThemeNavigationGroup[] = JSON.parse(JSON.stringify(this.navigation));

    clonedNavigation.forEach((group: FrThemeNavigationGroup) => {
      const key = group.label;
      if (!currentResource) {
        group.label = '----';

        this.setAlert(key);
        this.localizeNavigationItemName([], group.items);
        return;
      }

      const objectedResource = Object.entries(currentResource);

      const groupLabel = objectedResource.find(x => x[0] === key);
      if (!groupLabel || !groupLabel[1]) {
        group.label = '----';
        this.setAlert(key);
      }
      else {
        group.label = groupLabel[1];
      }

      this.localizeNavigationItemName(objectedResource, group.items);
    });

    return clonedNavigation;
  }

  private localizeNavigationItemName = (objectedResource: [string, string][], items?: FrThemeNavigationItem[]): void => {
    if (!items) {
      return;
    }

    items.forEach((item: FrThemeNavigationItem) => {
      const key = item.label;
      if (objectedResource.length === 0) {
        item.label = '----';

        this.setAlert(key);
        this.localizeNavigationItemName(objectedResource, item.children);
        return;
      }

      const itemLabel = objectedResource.find(x => x[0] === key);
      if (!itemLabel || !itemLabel[1]) {
        item.label = '----';
        this.setAlert(key);
      }
      else {
        item.label = itemLabel[1];
      }

      this.localizeNavigationItemName(objectedResource, item.children);
    });
  }

  private setAlert = (key: string) => {
    console.warn(`${this.localizationService.currentLanguage.language}.${key}`);
  }
}
