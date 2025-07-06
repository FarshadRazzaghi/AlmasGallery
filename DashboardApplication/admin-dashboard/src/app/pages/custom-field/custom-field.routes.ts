import { Route } from "@angular/router";

import { CustomFieldListComponent } from "./custom-field-list/custom-field-list.component";
import { CustomFieldUpsertComponent } from "./custom-field-upsert/custom-field-upsert.component";

export const CustomFieldRoutes: Route = {
	path: 'custom-fields',
	children: [
		{
			path: '',
			component: CustomFieldListComponent
		},
		{
			path: 'add',
			component: CustomFieldUpsertComponent
		},
		{
			path: ':id/edit',
			component: CustomFieldUpsertComponent
		},
	]
};
