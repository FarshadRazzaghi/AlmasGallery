import { Route } from "@angular/router";
import { ProductCategoryListComponent } from "../product-category/product-category-list/product-category-list.component";
import { ProductCategoryUpsertComponent } from "../product-category/product-category-upsert/product-category-upsert.component";

export const ProductRoutes: Route = {
	path: 'products',
	children: [
		// TODO - remove this file when the new product page is ready
		{
			path: '',
			component: ProductCategoryListComponent
		},
		{
			path: 'add',
			component: ProductCategoryUpsertComponent
		},
		{
			path: ':id/edit',
			component: ProductCategoryUpsertComponent
		},
	]
};
