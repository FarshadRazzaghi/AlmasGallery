import { Route } from "@angular/router";

import { ProductUpsertComponent } from './product-upsert/product-upsert.component';
import { ProductListComponent } from "./product-list/product-list.component";

export const ProductRoutes: Route = {
  path: 'products',
  children: [
    {
      path: '',
      component: ProductListComponent
    },
    {
      path: 'add',
      component: ProductUpsertComponent
    },
    {
      path: ':id/edit',
      component: ProductUpsertComponent
    },
  ]
};
