import { Component, ElementRef, ViewEncapsulation, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FrWidgetError } from '@fr-widget/sdk';
import { Subscription } from 'rxjs';
import { v7 as uuid } from 'uuid';

import { _CustomFieldUpsertBaseComponent } from './_custom-field-upsert.base.component';
import { CustomFieldService } from '../custom-field.service';

import { CustomFieldGroupComponent } from './custom-field-group/custom-field-group.component';
import { CustomFieldOptionComponent } from './custom-field-option/custom-field-option.component';
import { CustomFieldDeleteModalComponent } from './_custom-field-delete-modal/custom-field-delete.modal.component';

import { BaseHttpResponse } from '../../../helper/http/http.interface.ts';
import { HeaderActionButton } from '../../../types/button.interface';
import { CustomFieldOptionRequest, CustomFieldRequest } from '../../../types/custom-field/custom-field-request.type';
import { CustomFieldUpsert, CustomFieldUpsertOption, convertToRequest } from '../../../types/custom-field/custom-field-upsert.type';

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
		CustomFieldDeleteModalComponent,
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
			.customFieldDelete
			.subscribe((value: boolean) => {
				if (value) {
					this.isSubmitting = false;
					this.customFieldService.resetCustomField(true);
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
				const httpResponse: BaseHttpResponse<CustomFieldRequest> = await this.customFieldService.httpService.getSingle(this.customFieldId);
				if (!httpResponse.status || !httpResponse.data) {
					// TODO - REDIRECT TO 404 NOT FOUND PAGE;
					throw new FrWidgetError("PAGE NOT  FOUND");
				}

				const data: CustomFieldRequest = httpResponse.data;
				const customFieldOptions: CustomFieldUpsertOption[] = [];

				(data.customFields ?? [])
					.forEach((x: CustomFieldOptionRequest) => {
						const option: CustomFieldUpsertOption = x as CustomFieldUpsertOption;
						const parent = data.customFields?.find(x => x.id == option.parentId);
						if (parent) {
							option.customFieldParent = (parent as CustomFieldUpsertOption).uuid;
						}

						option.uuid = uuid();
						customFieldOptions.push(option);
					})

				const customField: CustomFieldUpsert = {
					id: data.id,
					groupName: data.name,
					groupType: data.entityType,
					options: customFieldOptions
				}
				this.customField = customField;
			}

			this.customFieldLoaded = true;
		})
	}

	protected override onDestroy(): void {
		this.customFieldService.customField = {};
		this.applicationDocumentService.clearFormResult();

		this.deleteSubscription.unsubscribe();

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
					let httpResponse: BaseHttpResponse<null | CustomFieldRequest> = { status: false, };
					const requestModel = convertToRequest(this.customFieldService.customField);

					if (this.operation === 'AddNew') {
						httpResponse = await this.customFieldService.httpService.create(requestModel);
					}
					else {
						httpResponse = await this.customFieldService.httpService.update(this.customFieldId ?? 0, requestModel);
					}

					if (httpResponse.status) {
						this.isSubmitting = false;
						this.customFieldService.resetCustomField(true);
						this.router.navigate(['custom-fields']);
					}
				}

				this.isSubmitting = false;
			}
		})
	}
}
