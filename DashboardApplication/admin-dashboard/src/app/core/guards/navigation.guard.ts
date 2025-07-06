import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment'

import { RoutingService } from '../services';

export const NavigationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const routingService = inject(RoutingService);

  const requestedPath = state.url.split('?')[0];
  const matchedRoute = routingService.findRoute(requestedPath, router.config);

  if (!matchedRoute) {
    router.navigate([`/${environment.dashboard}/not-found`]);
    return false;
  }

  if (!(matchedRoute.data?.enabled ?? true)) {
    router.navigate([`/${environment.dashboard}/access-denied`]);
    return false;
  }

  return true;
};
