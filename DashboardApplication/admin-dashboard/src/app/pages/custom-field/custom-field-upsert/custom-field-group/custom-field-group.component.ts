import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { _CustomFieldUpsertBaseComponent } from '../_custom-field-upsert.base.component';

import { CustomFieldGroupEntityType } from '../../../../generated/api-schematics.generator';

import * as FrForm from '@fr-widget/sdk/form';

export interface CustomFieldGroup {
	groupName?: string;
	groupEntityType?: number;
}

@Component({
	selector: 'custom-field-group',
	standalone: true,
	imports: [
		FrForm.FrFormComponent,
		FrForm.FrFormControlComponent,
		FrForm.FrFormControlDirectiveModule,
	],
	templateUrl: './custom-field-group.component.html',
	encapsulation: ViewEncapsulation.None
})
export class CustomFieldGroupComponent extends _CustomFieldUpsertBaseComponent {

	@ViewChild('groupForm') form!: FrForm.FrFormComponent<CustomFieldGroup>;

	// #region Fields
	private subscription: Subscription;
	private resetSubscription: Subscription;
	// #endregion Fields

	// #region Validators
	protected groupValidators: FrForm.FrFormControlValidator = {
		required: true
	}
	protected groupTypeValidators: FrForm.FrFormControlValidator = {
		required: true
	}
	// #endregion Validators

	//#region DropDownItems
	protected groupTypeItems: FrForm.FrInputValueItem<number>[] = [];
	//#endregion DropDownItems

	constructor(elementRef: ElementRef) {
		super(elementRef);

		this.subscription = this.applicationDocumentService
			.formValidation
			.subscribe(async () => {
				if (this.form) {
					const model = await this.form.onSubmit();
					this.applicationDocumentService.addResult(this.form.id, model.isValid);

					if (model.isValid && model.data) {
						this.customFieldService.customFieldGroup.name = model.data.groupName || '';
						this.customFieldService.customFieldGroup.entityType = (model.data.groupEntityType || 1) as CustomFieldGroupEntityType;
					}
				}
			})

		this.resetSubscription = this.customFieldService
			.customFieldGroupReset
			.subscribe(option => {
				if (this.form && option) {
					setTimeout(async () => {
						await this.onReset();
					})
				}
			})
	}

	protected override async afterViewInit(): Promise<void> {
		const model: CustomFieldGroup = {
			groupName: this.customFieldService.customFieldGroup.name,
			groupEntityType: this.customFieldService.customFieldGroup.entityType,
		};

		await this.form.setModel(model);
	}

	protected override onDestroy(): void {
		this.subscription.unsubscribe();
		this.resetSubscription.unsubscribe();

		super.onDestroy();
	}

	protected override async onLanguageChange(): Promise<void> {
		this.groupTypeItems = await this.getGroupTypes();

		super.onLanguageChange();
	}

	// #region Private Methods
	private getGroupTypes = async (): Promise<FrForm.FrInputValueItem<number>[]> => {
		const groupTypes = this.applicationLocalizationService.resource.enumResources.customFieldGroupType;
		return [{
			key: groupTypes.product,
			value: 1 as CustomFieldGroupEntityType,
			order: 1,
			selectable: true
		}];
	}

	private onReset = async (): Promise<void> => {
		await this.form.onReset();
	}
	// #endregion Private Methods
}
