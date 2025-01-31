import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { _CustomFieldUpsertBaseComponent } from '../_custom-field-upsert.base.component';
import { CustomFieldUpsertGroup } from '../../../../types/custom-field/custom-field-upsert.type';

import { DropdownHelper } from '../../../../helper/dropdown.helper';
import { CustomFieldGroupType } from '../../../../generator/generated/enum.component';

import * as FrForm from '@fr-widget/sdk/form';

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

	@ViewChild('customFieldGroupForm') form!: FrForm.FrFormComponent<CustomFieldUpsertGroup>;

	// #region Fields
	private subscription: Subscription;
	private resetSubscription: Subscription;
	// #endregion Fields

	// #region Validators
	protected customFieldGroupValidators: FrForm.FrFormControlValidator = {
		required: true
	}
	protected customFieldGroupTypeValidators: FrForm.FrFormControlValidator = {
		required: true
	}
	// #endregion Validators

	//#region DropDownItems
	protected customFieldGroupTypeItems: FrForm.FrInputValueItem<number>[] = [];
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
						this.customField.groupName = model.data.groupName;
						this.customField.groupType = model.data.groupType;
					}
				}
			})

		this.resetSubscription = this.customFieldService
			.customFieldReset
			.subscribe(option => {
				if (this.form && option) {
					setTimeout(async () => {
						await this.onReset();
					})
				}
			})
	}

	protected override async afterViewInit(): Promise<void> {
		const model: CustomFieldUpsertGroup = {
			groupName: this.customField.groupName,
			groupType: this.customField.groupType,
		};

		await this.form.setModel(model);
	}

	protected override onDestroy(): void {
		this.subscription.unsubscribe();
		this.resetSubscription.unsubscribe();

		super.onDestroy();
	}

	protected override async onLanguageChange(): Promise<void> {
		this.customFieldGroupTypeItems = await this.getCustomFieldGroupTypes();

		super.onLanguageChange();
	}

	// #region Private Methods
	private getCustomFieldGroupTypes = async (): Promise<FrForm.FrInputValueItem<number>[]> => {
		return DropdownHelper.getDropDownItemsFromEnumeration(CustomFieldGroupType, 'customFieldGroupType');
	}

	private onReset = async (): Promise<void> => {
		await this.form.onReset();
	}
	// #endregion Private Methods
}
