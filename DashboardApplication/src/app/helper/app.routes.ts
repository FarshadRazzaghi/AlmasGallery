import { Routes } from "@angular/router";

import { DefaultComponent } from "../layout/default/default.component";
import { DashboardComponent } from "../pages/dashboard/dashboard.component";
import { ProductRoutes } from "../pages/products/product.routes";

export const AppRoutes: Routes = [
  { path: '', redirectTo: '/products/add', pathMatch: 'full' },
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
