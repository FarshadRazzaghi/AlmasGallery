import { Routes } from "@angular/router";

import { DefaultComponent } from "../layout/default/default.component";
import { DashboardComponent } from "../pages/dashboard/dashboard.component";

export const AppRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
    ]
  },
];
