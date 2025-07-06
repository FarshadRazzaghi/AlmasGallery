import { NavigationGroup } from "@core/models";
import { DashboardComponent } from "@features/dashboard";
import { ListComponent as CustomFieldGroupListComponent, UpsertComponent as CustomFieldGroupUpsertComponent } from "@features/custom-field-groups";
import { ListComponent as ProductCategoryListComponent, UpsertComponent as ProductCategoryUpsertComponent } from "@features/product-categories";
import { environment } from '@environments/environment'

import { ForbiddenComponent, NotFoundComponent, ServerErrorComponent, NavigationRouteComponent } from "../pages";

export type AvaliableRoute =
  | 'dashboard'
  | 'customFieldGroups'
  | 'productCategory'
  | 'accessDenied'
  | 'serverError'
  | 'notFound';

export const NavigationRoute: Record<AvaliableRoute, string> = {
  dashboard: environment.dashboard,
  customFieldGroups: 'custom-field-groups',
  productCategory: 'product-categories',
  accessDenied: 'access-denied',
  serverError: 'server-error',
  notFound: 'not-found'
};

export const NAVIGATION: NavigationGroup[] = [
  {
    id: 0,
    label: 'navigation',
    visible: true,
    showLabel: false,
    items: [
      {
        id: 0,
        label: environment.dashboard,
        icon: 'ri-home-line',
        visible: true,
        enabled: true,
        routeLink: '',
        component: DashboardComponent,
      }
    ],
  },
  {
    id: 1,
    label: 'appManagement',
    visible: true,
    showLabel: true,
    items: [
      {
        id: 0,
        label: 'customFieldGroups',
        icon: 'ri-settings-line',
        visible: true,
        enabled: true,
        routeLink: NavigationRoute['customFieldGroups'],
        component: NavigationRouteComponent,
        children: [
          {
            id: 0,
            label: 'customFieldGroupList',
            icon: 'ri-settings-line',
            visible: true,
            enabled: true,
            routeLink: '',
            component: CustomFieldGroupListComponent,
          },
          {
            id: 1,
            label: 'customFieldGroupAdd',
            icon: 'ri-settings-line',
            visible: false,
            enabled: true,
            routeLink: 'add',
            component: CustomFieldGroupUpsertComponent
          },
          {
            id: 2,
            label: 'customFieldGroupEdit',
            icon: 'ri-settings-line',
            visible: false,
            enabled: true,
            routeLink: ':id/edit',
            component: CustomFieldGroupUpsertComponent
          }
        ]
      },
    ]
  },
  {
    id: 2,
    label: 'productManagement',
    visible: true,
    showLabel: true,
    items: [
      {
        id: 0,
        label: 'productCategories',
        icon: 'ri-archive-2-line',
        visible: true,
        enabled: true,
        routeLink: NavigationRoute['productCategory'],
        component: NavigationRouteComponent,
        children: [
          {
            id: 0,
            label: 'productCategoryList',
            icon: 'ri-archive-2-line',
            visible: true,
            enabled: true,
            routeLink: '',
            component: ProductCategoryListComponent
          },
          {
            id: 1,
            label: 'productCategoryAdd',
            icon: 'ri-settings-line',
            visible: true,
            enabled: true,
            routeLink: 'add',
            component: ProductCategoryUpsertComponent
          },
          {
            id: 2,
            label: 'productCategoryEdit',
            icon: 'ri-settings-line',
            visible: false,
            enabled: true,
            routeLink: ':id/edit',
            component: ProductCategoryUpsertComponent
          }
        ]
      },
    ]
  },
  {
    id: 3,
    label: 'error',
    visible: true,
    showLabel: false,
    items: [
      {
        id: 1,
        label: 'forbidden',
        icon: 'ri-home-line',
        visible: false,
        enabled: true,
        routeLink: NavigationRoute['accessDenied'],
        component: ForbiddenComponent
      },
      {
        id: 2,
        label: 'serverError',
        icon: 'ri-home-line',
        visible: false,
        enabled: true,
        routeLink: NavigationRoute['serverError'],
        component: ServerErrorComponent
      },
      {
        id: 3,
        label: 'notFound',
        icon: '',
        visible: false,
        enabled: true,
        routeLink: '**',
        component: NotFoundComponent
      }
    ],
  },
];
