import { Route } from "@angular/router";

import { ProductCategoryListComponent } from "./product-category-list/product-category-list.component";
import { ProductCategoryUpsertComponent } from "./product-category-upsert/product-category-upsert.component";

export const ProductCategoryRoutes: Route = {
  path: 'product-categories',
  children: [
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
