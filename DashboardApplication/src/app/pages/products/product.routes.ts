import { Route } from "@angular/router";
import { AddNewComponent } from './add-new/add-new.component';

export const ProductRoutes: Route = {
  path: 'products',
  children: [
    {
      path: 'add',
      component: AddNewComponent
    },
  ]
};
