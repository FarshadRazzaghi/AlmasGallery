import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from '@layout/index';
import { NotFoundComponent, ForbiddenComponent } from '@core/pages';
import { environment } from '@environments/environment'
import { NavigationRoute } from './core/config/navigation.config';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: environment.dashboard,
    pathMatch: 'full'
  },
  {
    path: environment.dashboard,
    component: DefaultLayoutComponent,
    children: []
  },
  {
    path: NavigationRoute['accessDenied'],
    component: ForbiddenComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
