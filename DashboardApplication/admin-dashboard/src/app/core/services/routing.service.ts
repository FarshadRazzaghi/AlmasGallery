import { inject, Injectable, Type } from '@angular/core';
import { NAVIGATION } from '@core/config/navigation.config';
import { Route } from '@angular/router';
import { environment } from '@environments/environment'

import { NavigationGuard } from '../guards';
import * as models from '../models';
import * as services from '../services';

@Injectable({ providedIn: 'root' })
export class RoutingService {

  private readonly localizationService = inject(services.LocalizationService);

  private readonly navigation: models.NavigationGroup[] = NAVIGATION;

  public get navigationGroup(): models.NavigationGroup[] {
    const currentResource: models.RoutingResource | undefined = this.localizationService.resource?.routingResource;
    const clonedNavigation = this.deepClone(this.navigation);

    clonedNavigation.forEach(group => {
      this.localizeGroup(group, currentResource);
    });

    return clonedNavigation;
  }

  public generateRoutes(navigationGroup: models.NavigationGroup[], basePath: string = ''): Route[] {
    const routes: Route[] = [];

    navigationGroup.forEach((group: models.NavigationGroup) => {
      group.items.forEach((item: models.NavigationItem) => {
        const fullPath = basePath ? `${basePath}/${item.routeLink}` : item.routeLink;

        const route: any = {
          path: this.normalizePath(item.routeLink),
          canActivate: [NavigationGuard],
          data: { label: item.label, icon: item.icon, enabled: item.enabled },
        };

        if (item.component) {
          route.component = item.component as Type<any>;
        }

        // Handle child routes recursively
        if (item.children && item.children.length > 0) {
          route.children = this.generateRoutes([{
            id: group.id,
            label: group.label,
            visible: group.visible,
            showLabel: group.showLabel,
            items: item.children
          }], fullPath);
        }

        routes.push(route);
      });
    });

    return routes;
  }

  public findNavigationNodeByPath(path: string, navigationGroups: models.NavigationGroup[]): any {
    const routes: Route[] = this.generateRoutes(navigationGroups);
    return this.findRoute(path, routes);
  }

  public findRoute = (path: string, routes: Route[]): any => {
    return this.searchRoutes(routes, path);
  };

  public applyParentRoutePrefix(item: models.NavigationItem, parentPath: string = ''): void {
    item.routeLink = this.normalizePath(`${parentPath}/${item.routeLink || ''}`);

    if (item.children?.length) {
      item.children.forEach(child => {
        this.applyParentRoutePrefix(child, item.routeLink);
      });
    }
  }

  private searchRoutes(routes: Route[], path: string, parentPath?: string): any {
    let matchedRoute = null;
    const dashboardPrefix: string = environment.dashboard;
    const dashboardRegex = new RegExp(`^\\/${dashboardPrefix}(\\/|$)`);
    const normalizedPath = path.replace(dashboardRegex, '/').replace(/\/+/g, '/');

    for (const route of routes) {
      if (route.path === '**') {
        continue;
      }

      const rawRoutePath = (parentPath ? `/${parentPath}/${route.path}` : `/${route.path}`).replace(/\/+/g, '/');
      const escapedRoutePath = this.escapeRegExpExceptColon(rawRoutePath);
      const pattern = `^${escapedRoutePath.replace(/:\w+/g, '[^/]+')}$`;

      const routeRegex = new RegExp(pattern);
      if (routeRegex.test(normalizedPath)) {
        return route;
      }

      if (route.children) {
        matchedRoute = this.searchRoutes(route.children, normalizedPath, route.path);
        if (matchedRoute) {
          return matchedRoute;
        }
      }
    }

    return routes.find(route => route.path === '**') || null;
  }

  private escapeRegExpExceptColon(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private localizeGroup(group: models.NavigationGroup, resource?: models.RoutingResource): void {
    const entries = resource ? Object.entries(resource) : [];
    const groupKey = group.label;
    const translatedGroupLabel = entries.find(([k]) => k === groupKey)?.[1] || '----';

    if (translatedGroupLabel === '----') {
      this.logMissingResource(groupKey);
    }
    group.label = translatedGroupLabel[group.label];

    this.localizeItems(translatedGroupLabel, group.items, groupKey);
  }

  private localizeItems(resourceEntries: { [key: string]: string }, items?: models.NavigationItem[], prefix: string = ''): void {
    if (!items) return;

    items.forEach((item) => {
      const fullKey = prefix ? `${prefix}.${item.label}` : item.label;
      const translatedLabel = resourceEntries[item.label] || '----';

      if (translatedLabel === '----') {
        this.logMissingResource(fullKey);
      }

      item.label = translatedLabel;
      this.localizeItems(resourceEntries, item.children, fullKey);
    });
  }

  private logMissingResource(key: string): void {
    const lang = this.localizationService.currentLanguage.language;
    console.warn(`resource.${lang}.${key}`);
  }

  private normalizePath(path: string): string {
    return path.replace(/^\/+|\/+$/g, '');
  }

  private deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepClone(item)) as any;
    }

    const clonedObj: any = {};
    for (const key in obj) {
      if (key === 'component') {
        clonedObj[key] = obj[key];
      } else {
        clonedObj[key] = this.deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}
