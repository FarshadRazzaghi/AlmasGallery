import { Routes } from "@angular/router";

import { DefaultComponent } from "../layouts/default/default.component";
import { DashboardComponent } from "../pages/dashboard/dashboard.component";
import { ProductRoutes } from "../pages/product/product.routes";
import { CustomFieldRoutes } from "../pages/custom-field/custom-field.routes";
import { ProductCategoryRoutes } from "../pages/product-category/product-category.routes";

export const AppRoutes: Routes = [
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full', },
	{
		path: '',
		component: DefaultComponent,
		children: [
			{
				path: 'dashboard',
				component: DashboardComponent
			},
			CustomFieldRoutes,
			ProductRoutes,
			ProductCategoryRoutes
		]
	},
];
