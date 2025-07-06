import { Component, ElementRef, ViewEncapsulation, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FrWidgetError } from '@fr-widget/sdk';
import { Subscription } from 'rxjs';
import { v7 as uuid } from 'uuid';

import { _CustomFieldUpsertBaseComponent } from './_custom-field-upsert.base.component';
import { CustomFieldService } from '../custom-field.service';

import { CustomFieldGroupResponse, CustomFieldResponse } from '../../../generated/api-schematics.generator';
import { BaseHttpResponse } from '../../../generated/helpers/interface.generated';

import { CustomFieldGroupComponent } from './custom-field-group/custom-field-group.component';
import { CustomFieldOptionComponent } from './custom-field-option/custom-field-option.component';
//import { CustomFieldDeleteModalComponent } from './_custom-field-delete-modal/custom-field-delete.modal.component';

import { CustomField } from '../../../types/custom-field/custom-field-upsert.type';
import { HeaderActionButton } from '../../../types/button.interface';

import * as FrCard from '@fr-widget/sdk/card';
import * as FrForm from '@fr-widget/sdk/form';
import * as FrButton from '@fr-widget/sdk/button';
import * as FrModal from '@fr-widget/sdk/modal';

@Component({
	selector: 'custom-field-upsert',
	standalone: true,
	imports: [
		FrButton.FrButtonDirective,

		FrForm.FrFormComponent,
		FrForm.FrFormControlComponent,
		FrForm.FrFormControlDirectiveModule,

		FrCard.FrCardComponent,
		FrCard.FrCardHeaderComponent,
		FrCard.FrCardFooterComponent,

		CustomFieldGroupComponent,
		CustomFieldOptionComponent,
		//CustomFieldDeleteModalComponent,
	],
	templateUrl: './custom-field-upsert.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [CustomFieldService]
})
export class CustomFieldUpsertComponent extends _CustomFieldUpsertBaseComponent {

	protected get actionButtons(): HeaderActionButton[] {
		const actionButtons: HeaderActionButton[] = [
			{
				directive: 'button',
				color: 'danger',
				identifierName: 'Delete',
				text: '',
				isVisible: true,
				isEnable: true,
				type: 'button',
				onClick: () => this.modalService.openModal(this.deleteModalId),
			},
			{
				directive: 'waiting',
				color: 'success',
				identifierName: 'Submit',
				type: 'submit',
				text: '',
				isVisible: true,
				isEnable: true,
				isWaiting: false,
				onClick: () => this.onSubmit(),
			},
			{
				directive: 'link',
				color: 'primary',
				identifierName: 'BackToList',
				text: '',
				isVisible: true,
				isEnable: true,
				target: '_self',
				isExternalLink: false,
				routeLink: '/custom-fields'
			}
		];

		Object.defineProperties(actionButtons.find(x => x.identifierName === 'BackToList'), {
			text: {
				get: () => { return this.applicationLocalizationService.resource.backToPrevious; }
			}
		});

		Object.defineProperties(actionButtons.find(x => x.identifierName === 'Submit'), {
			isWaiting: {
				get: () => { return this.isSubmitting; }
			},
			text: {
				get: () => { return this.applicationLocalizationService.resource.submit; }
			}
		});

		Object.defineProperties(actionButtons.find(x => x.identifierName === 'Delete'), {
			isVisible: {
				get: () => { return this.operation === 'Update'; }
			},
			text: {
				get: () => { return this.applicationLocalizationService.resource.remove; }
			}
		});

		return actionButtons;
	}

	// #region Fields
	private modalService: FrModal.FrModalService = inject(FrModal.FrModalService);

	protected customFieldLoaded: boolean;
	protected deleteModalId: string;
	protected operation: 'AddNew' | 'Update';

	private customFieldId?: number;
	private isSubmitting: boolean;

	private deleteSubscription: Subscription;
	// #endregion Fields

	constructor(elementRef: ElementRef, private activatedRoute: ActivatedRoute, private router: Router) {
		super(elementRef);

		this.operation = 'AddNew';
		this.isSubmitting = false;
		this.deleteModalId = 'custom-field-delete';
		this.customFieldLoaded = false;

		const param = this.activatedRoute.snapshot.paramMap.get('id')?.trim();
		if (param) {
			const castedParam = +param;
			if (isNaN(castedParam)) {
				// TODO - REDIRECT TO 404 NOT FOUND PAGE;
				throw new FrWidgetError("PAGE NOT  FOUND");
			}

			this.customFieldId = castedParam;
			this.operation = 'Update';
		}

		this.deleteSubscription = this.customFieldService
			.customFieldGroupDelete
			.subscribe((value: boolean) => {
				if (value) {
					this.isSubmitting = false;
					this.customFieldService.resetCustomFieldGroup(true);
					this.router.navigate(['custom-fields']);
				}
			})
	}

	protected override onInit(): void {
		this.applicationDocumentService.setButtons(this.actionButtons);
	}

	protected override afterViewInit(): void {
		setTimeout(async () => {
			this.customFieldLoaded = false;

			if ((this.customFieldId || this.customFieldId == 0) && this.operation === 'Update') {
				const httpResponse: BaseHttpResponse<CustomFieldGroupResponse> = await this.customFieldService.httpService.getCustomFieldGroupById(this.customFieldId);
				if (!httpResponse.status || !httpResponse.data) {
					// TODO - REDIRECT TO 404 NOT FOUND PAGE;
					throw new FrWidgetError("PAGE NOT  FOUND");
				}

				const data = httpResponse.data;

				this.customFieldService.customFieldGroup.id = data.id;
				this.customFieldService.customFieldGroup.name = data.name;
				this.customFieldService.customFieldGroup.entityType = data.entityType;

				data.customFields.forEach((option: CustomFieldResponse) => {
					const castedOption: CustomField = option as CustomField;
					castedOption.uniqueId = uuid();
					this.customFieldService.customFieldGroup.customFields.push(castedOption);
				})
			}

			this.customFieldLoaded = true;
		})
	}

	protected override onDestroy(): void {
		this.applicationDocumentService.clearFormResult();
		this.deleteSubscription.unsubscribe();

		this.customFieldService.clearCustomFieldGroup();
		super.onDestroy();
	}

	protected onSubmit = (): void => {
		this.applicationDocumentService.validateForm();

		setTimeout(async () => {
			this.isSubmitting = true;

			const formSubmitResults = this.applicationDocumentService.getResults();
			if (formSubmitResults.length > 0) {
				const canSubmit = formSubmitResults.map(x => x.result).every(x => x);
				if (canSubmit) {
					const customFieldGroup = this.customFieldService.customFieldGroup;
					console.log('customFieldGroup', customFieldGroup);

					// const requestModel: CustomFieldGroupRequest = {
					// 	entityType: customFieldGroup.entityType,
					// 	name: customFieldGroup.name,
					// 	customFields: customFieldGroup.customFields.map((x: CustomField) => ({
					// 		id: x.id,
					// 		name: x.name,
					// 		isRequired: x.isRequired,
					// 		isActive: x.isActive,
					// 		helpText: x.helpText,
					// 		uniqueId: x.uuid,
					// 		placeHolder: x.placeHolder,
					// 		initialValue: x.initialValue?.toString(),
					// 		dataType: x.dataType,
					// 		validation: x.validation,
					// 		parentUniqueId: x.parentUniqueId,
					// 		parentCondition: x.parentCondition?.toString(),
					// 	})),
					// };

					const httpResponse: BaseHttpResponse<CustomFieldGroupResponse> = { status: false, };
					if (this.operation === 'AddNew') {
						//httpResponse = await this.customFieldService.httpService.createCustomFieldGroup(requestModel);
					}
					else {
						//httpResponse = await this.customFieldService.httpService.updateCustomFieldGroupById(this.customFieldId ?? 0, requestModel);
					}

					if (httpResponse.status) {
						this.isSubmitting = false;
						this.customFieldService.resetCustomFieldGroup(true);
						this.router.navigate(['custom-fields']);
					}
				}

				this.isSubmitting = false;
			}
		})
	}
}
