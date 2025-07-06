import { Route } from "@angular/router";


export const ProductCategoryRoutes: Route = {
	path: 'product-categories',
	// TODO - add lazy loading
	children: [
		// {
		//   path: '',
		//   component: ProductCategoryListComponent
		// },
		// {
		//   path: 'add',
		//   component: ProductCategoryUpsertComponent
		// },
		// {
		//   path: ':id/edit',
		//   component: ProductCategoryUpsertComponent
		// },
	]
};
