import { Routes } from "@angular/router";

import { DefaultComponent } from "../layout/default/default.component";
import { DashboardComponent } from "../pages/dashboard/dashboard.component";
import { ProductRoutes } from "../pages/product/product.routes";

export const AppRoutes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      ProductRoutes,
    ]
  },
];
