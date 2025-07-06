import { Component, ViewEncapsulation, inject } from '@angular/core';

import { _CustomFieldBaseComponent } from '../_custom-field.base.component';

import { CustomFieldService } from '../custom-field.service';

@Component({
	selector: 'custom-field-upsert-base',
	standalone: true,
	imports: [],
	template: '',
	encapsulation: ViewEncapsulation.None,
})
export abstract class _CustomFieldUpsertBaseComponent extends _CustomFieldBaseComponent {
	protected customFieldService: CustomFieldService = inject(CustomFieldService);
}
