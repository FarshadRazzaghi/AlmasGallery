import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { _CustomFieldBaseComponent } from '../_custom-field.base.component';

import { HeaderActionButton } from '../../../types/button.interface';

import * as FrCard from '@fr-widget/sdk/card';
import * as FrDataGrid from '@fr-widget/sdk/data-grid';
import { CustomFieldGroupResponse, CustomFieldResponse } from '../../../generated/api-schematics.generator';
import { CustomFieldGroupsHttpService } from '../../../generated/services/custom-field-groups.service.generator';

@Component({
	selector: 'custom-field-list',
	standalone: true,
	imports: [
		RouterLink,

		FrCard.FrCardComponent,
		FrCard.FrCardHeaderComponent,
		FrCard.FrCardFooterComponent,

		FrDataGrid.FrDataGridComponent,
	],
	templateUrl: './custom-field-list.component.html',
	encapsulation: ViewEncapsulation.None
})
export class CustomFieldListComponent extends _CustomFieldBaseComponent {

	@ViewChild('customFieldListDataGrid') dataGrid!: FrDataGrid.FrDataGridComponent<CustomFieldGroupResponse>;

	protected get actionButtons(): HeaderActionButton[] {
		const actionButtons: HeaderActionButton[] = [
			{
				directive: 'link',
				color: 'primary',
				identifierName: 'AddNewCustomField',
				text: '',
				isVisible: true,
				isEnable: true,
				target: '_self',
				isExternalLink: false,
				routeLink: '/custom-fields/add'
			}
		];

		Object.defineProperties(actionButtons.find(x => x.identifierName === 'AddNewCustomField'), {
			text: {
				get: () => { return this.applicationLocalizationService.resource.routingResource.customFieldsAdd; }
			}
		});

		return actionButtons;
	}

	protected get columns(): FrDataGrid.FrDataGridColumn[] {
		return [
			{
				dataType: 'string',
				field: 'name',
				header: this.customFieldResource.groupName,
				sortable: true,
				width: 200
			},
			{
				dataType: 'string',
				field: 'entityType',
				header: this.customFieldResource.groupEntityType,
				sortable: true,
				width: 100
			},
			{
				dataType: 'string',
				field: 'customFields',
				header: 'customFields',
				sortable: true,
				visible: false,
				width: 500
			}
		];
	}

	constructor(elementRef: ElementRef, private customFieldHttpService: CustomFieldGroupsHttpService, private routing: ActivatedRoute) {
		super(elementRef);
	}

	protected override onInit(): void {
		this.applicationDocumentService.setButtons(this.actionButtons);
	}

	protected override async afterViewInit(): Promise<void> {
		const list = await this.customFieldHttpService.getAllCustomFieldGroups();
		if (list.status) {
			const model = (list.data ?? []);

			setTimeout(() => {
				this.dataGrid.setRecords(model);
			})
		}
	}

	protected onClick = (record: CustomFieldResponse): void => {
		console.log(record);
	}
}
