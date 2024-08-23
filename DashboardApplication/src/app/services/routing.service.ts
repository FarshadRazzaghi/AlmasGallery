import { Injectable, inject } from '@angular/core';

import { LocalizationService } from './localization.service';
import { FrThemeNavigationGroup, FrThemeNavigationItem } from '@fr-theme/common';
import { Resource } from '../_i18n/resource/resource';


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
          routeLink: '/',
          children: [
            {
              id: 0,
              label: 'analytics',
              routeLink: '/analytics',
              visible: true,
              enabled: true,
            },
            {
              id: 1,
              label: 'ECommerce',
              routeLink: '/e-commerce',
              visible: true,
              enabled: true,
            },
            {
              id: 2,
              label: 'projects',
              routeLink: '/projects',
              visible: true,
              enabled: true,
            },
            {
              id: 3,
              label: 'CRM',
              routeLink: '/crm',
              visible: true,
              enabled: true,
            },
            {
              id: 4,
              label: 'EWallet',
              routeLink: '/e-wallet',
              visible: true,
              enabled: true,
            }
          ]
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
          label: 'calendar',
          icon: 'ri-calendar-line',
          visible: true,
          enabled: true,
          routeLink: '/calendar',
        },
        {
          id: 1,
          label: 'chat',
          icon: 'ri-chat-2-line',
          visible: true,
          enabled: true,
          routeLink: '/chat',
        },
        {
          id: 2,
          label: 'CRM',
          icon: 'ri-crosshair-line',
          visible: true,
          enabled: true,
          routeLink: '/crm',
        },
        {
          id: 3,
          label: 'ECommerce',
          icon: 'ri-store-line',
          visible: true,
          enabled: true,
          routeLink: '/e-commerce',
          children: [
            {
              id: 0,
              label: 'products',
              visible: true,
              enabled: true,
              routeLink: '/e-commerce/products',
            },
            {
              id: 1,
              label: 'productDetail',
              visible: true,
              enabled: true,
              routeLink: '/e-commerce/products/{:id}',
            },
            {
              id: 2,
              label: 'orders',
              visible: true,
              enabled: true,
              routeLink: '/e-commerce/order',
            },
            {
              id: 3,
              label: 'orderDetail',
              visible: true,
              enabled: true,
              routeLink: '/e-commerce/orders/{:id}',
            },
            {
              id: 4,
              label: 'customers',
              visible: true,
              enabled: true,
              routeLink: '/e-commerce/customers',
            },
            {
              id: 5,
              label: 'shoppingCart',
              visible: true,
              enabled: true,
              routeLink: '/e-commerce/shopping-cart',
            },
            {
              id: 6,
              label: 'checkout',
              visible: true,
              enabled: true,
              routeLink: '/e-commerce/checkout',
            },
            {
              id: 7,
              label: 'sellers',
              visible: true,
              enabled: true,
              routeLink: '/e-commerce/sellers',
            },
          ]
        },
        {
          id: 4,
          label: 'email',
          icon: 'ri-mail-line',
          visible: true,
          enabled: true,
          routeLink: '/email',
          children: [
            {
              id: 0,
              label: 'inbox',
              visible: true,
              enabled: true,
              routeLink: '/email/inbox',
            },
            {
              id: 1,
              label: 'readEmail',
              visible: true,
              enabled: true,
              routeLink: '/email/{:id}',
            },
          ]
        },
        {
          id: 5,
          label: 'projects',
          icon: 'ri-briefcase-line',
          visible: true,
          enabled: true,
          routeLink: '/',
          children: [
            {
              id: 0,
              label: 'list',
              visible: true,
              enabled: true,
              routeLink: '/projects',
            },
            {
              id: 1,
              label: 'detail',
              visible: true,
              enabled: true,
              routeLink: '/projects/{:id}/detail',
            },
            {
              id: 2,
              label: 'gantt',
              visible: true,
              enabled: true,
              routeLink: '/projects/gantt',
            },
            {
              id: 3,
              label: 'createProject',
              visible: true,
              enabled: true,
              routeLink: '/projects/add',
            },
          ]
        },
        {
          id: 6,
          label: 'socialFeed',
          icon: 'ri-rss-line',
          visible: true,
          enabled: true,
          routeLink: '/social-feed',
        },
        {
          id: 7,
          label: 'tasks',
          icon: 'ri-task-line',
          visible: true,
          enabled: true,
          routeLink: '/',
          children: [
            {
              id: 0,
              label: 'list',
              visible: true,
              enabled: true,
              routeLink: '/tasks',
            },
            {
              id: 1,
              label: 'detail',
              visible: true,
              enabled: true,
              routeLink: '/tasks/{:id}/detail',
            },
            {
              id: 2,
              label: 'kanbanBoard',
              visible: true,
              enabled: true,
              routeLink: '/tasks/kanban-board',
            },
          ]
        },
        {
          id: 8,
          label: 'fileManage',
          icon: 'ri-folder-6-line',
          visible: true,
          enabled: true,
          routeLink: '/file-manage',
        },
      ]
    },
    {
      id: 2,
      label: 'custom',
      visible: true,
      showLabel: true,
      items: [
        {
          id: 0,
          label: 'pages',
          icon: 'ri-file-copy-line',
          visible: true,
          enabled: true,
          routeLink: '/',
          children: [
            {
              id: 0,
              label: 'profile',
              visible: true,
              enabled: true,
              routeLink: '/pages/profile',
            },
            {
              id: 1,
              label: 'profile_2',
              visible: true,
              enabled: true,
              routeLink: '/pages/profile-2',
            },
            {
              id: 2,
              label: 'invoice',
              visible: true,
              enabled: true,
              routeLink: '/pages/invoice',
            },
            {
              id: 3,
              label: 'FAQ',
              visible: true,
              enabled: true,
              routeLink: '/pages/faq',
            },
            {
              id: 4,
              label: 'pricing',
              visible: true,
              enabled: true,
              routeLink: '/pages/pricing',
            },
            {
              id: 5,
              label: 'maintenance',
              visible: true,
              enabled: true,
              routeLink: '/pages/maintenance',
            },
            {
              id: 6,
              label: 'authentication',
              visible: true,
              enabled: true,
              routeLink: '/pages/authentication',
            },
            {
              id: 7,
              label: 'error',
              visible: true,
              enabled: true,
              routeLink: '/pages/error',
            },
            {
              id: 8,
              label: 'starterPage',
              visible: true,
              enabled: true,
              routeLink: '/pages/starter-page',
            },
            {
              id: 9,
              label: 'withPreloader',
              visible: true,
              enabled: true,
              routeLink: '/pages/with-preloader',
            },
            {
              id: 10,
              label: 'timeline',
              visible: true,
              enabled: true,
              routeLink: '/pages/timeline',
            },
          ]
        },
        {
          id: 1,
          label: 'landing',
          icon: 'ri-global-line',
          visible: true,
          enabled: true,
          routeLink: '/landing',
        },
        {
          id: 2,
          label: 'layouts',
          icon: 'ri-layout-6-line',
          visible: true,
          enabled: true,
          routeLink: '/layouts',
          children: [
            {
              id: 0,
              label: 'horizontal',
              visible: true,
              enabled: true,
              routeLink: '/layouts/horizontal',
            },
            {
              id: 1,
              label: 'detached',
              visible: true,
              enabled: true,
              routeLink: '/layouts/detached',
            },
            {
              id: 2,
              label: 'invoice',
              visible: true,
              enabled: true,
              routeLink: '/pages/invoice',
            },
            {
              id: 3,
              label: 'fullView',
              visible: true,
              enabled: true,
              routeLink: '/layouts/full-view',
            },
            {
              id: 4,
              label: 'fullscreenView',
              visible: true,
              enabled: true,
              routeLink: '/layouts/fullscreen-view',
            },
            {
              id: 5,
              label: 'hoverMenu',
              visible: true,
              enabled: true,
              routeLink: '/layouts/hover-menu',
            },
            {
              id: 6,
              label: 'compact',
              visible: true,
              enabled: true,
              routeLink: '/layouts/compact',
            },
            {
              id: 7,
              label: 'iconView',
              visible: true,
              enabled: true,
              routeLink: '/layouts/icon-view',
            },
          ]
        },
        {
          id: 3,
          label: 'components',
          icon: 'ri-terminal-window-line',
          visible: true,
          enabled: true,
          routeLink: '/',
          children: [
            {
              id: 0,
              label: 'accordionAndCollapse',
              visible: true,
              enabled: true,
              routeLink: '/components/accordion-collapse',
            },
            {
              id: 1,
              label: 'alerts',
              visible: true,
              enabled: true,
              routeLink: '/components/alerts',
            },
            {
              id: 2,
              label: 'avatars',
              visible: true,
              enabled: true,
              routeLink: '/components/avatars',
            },
            {
              id: 3,
              label: 'badges',
              visible: true,
              enabled: true,
              routeLink: '/components/badges',
            },
            {
              id: 4,
              label: 'breadcrumbs',
              visible: true,
              enabled: true,
              routeLink: '/components/breadcrumbs',
            },
            {
              id: 5,
              label: 'buttons',
              visible: true,
              enabled: true,
              routeLink: '/components/buttons',
            },
            {
              id: 6,
              label: 'cards',
              visible: true,
              enabled: true,
              routeLink: '/components/cards',
            },
            {
              id: 7,
              label: 'carousel',
              visible: true,
              enabled: true,
              routeLink: '/components/carousel',
            },
            {
              id: 8,
              label: 'dropdowns',
              visible: true,
              enabled: true,
              routeLink: '/components/dropdowns',
            },
            {
              id: 9,
              label: 'embedVideo',
              visible: true,
              enabled: true,
              routeLink: '/components/embed-video',
            },
            {
              id: 10,
              label: 'grid',
              visible: true,
              enabled: true,
              routeLink: '/components/grid',
            },
            {
              id: 11,
              label: 'listGroup',
              visible: true,
              enabled: true,
              routeLink: '/components/list-group',
            },
            {
              id: 12,
              label: 'modal',
              visible: true,
              enabled: true,
              routeLink: '/components/modal',
            },
            {
              id: 13,
              label: 'notifications',
              visible: true,
              enabled: true,
              routeLink: '/components/notifications',
            },
            {
              id: 14,
              label: 'offcanvas',
              visible: true,
              enabled: true,
              routeLink: '/components/offcanvas',
            },
            {
              id: 15,
              label: 'placeholders',
              visible: true,
              enabled: true,
              routeLink: '/components/placeholders',
            },
            {
              id: 16,
              label: 'pagination',
              visible: true,
              enabled: true,
              routeLink: '/components/pagination',
            },
            {
              id: 17,
              label: 'popovers',
              visible: true,
              enabled: true,
              routeLink: '/components/popovers',
            },
          ]
        },
      ]
    }
  ];

  constructor() { }

  public get navigationGroup(): FrThemeNavigationGroup[] {
    const currrentResource: Resource | null = this.localizationService.resource;
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
