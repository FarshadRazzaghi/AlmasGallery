import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { v7 as uuid } from 'uuid';

import { _CustomFieldUpsertBaseComponent } from '../_custom-field-upsert.base.component';
import { equalOrGreaterValidator } from '../custom-field-validators.component';

import { CustomFieldOptionValidation, CustomFieldUpsertOption } from '../../../../types/custom-field/custom-field-upsert.type';

import { NameFromListPipe } from '../../../../pipes/name-from-list.pipe';
import { DropdownHelper } from '../../../../helper/dropdown.helper';
import { CustomFieldDataType } from '../../../../generator/generated/enum.component';

import * as FrForm from '@fr-widget/sdk/form';
import * as FrCard from '@fr-widget/sdk/card';
import * as FrButton from '@fr-widget/sdk/button';

export type ExtendedCustomFieldUpsertOption =
	CustomFieldUpsertOption & {
		initValueNumber?: number;
		initValueString?: string;
		initValueDateTime?: Date;
		initValueBoolean?: boolean;
		parentConditionNumber?: number;
		parentConditionString?: string;
		parentConditionDateTime?: Date;
		parentConditionBoolean?: boolean;
	}

@Component({
	selector: 'custom-field-option',
	standalone: true,
	imports: [
		NameFromListPipe,

		FrForm.FrFormComponent,
		FrForm.FrFormControlComponent,
		FrForm.FrFormGroupComponent,
		FrForm.FrFormControlDirectiveModule,

		FrCard.FrCardComponent,

		FrButton.FrButtonDirective
	],
	templateUrl: './custom-field-option.component.html',
	encapsulation: ViewEncapsulation.None
})
export class CustomFieldOptionComponent extends _CustomFieldUpsertBaseComponent {

	@ViewChild('customFieldForm') form!: FrForm.FrFormComponent<ExtendedCustomFieldUpsertOption>;

	protected get customFieldOptions(): CustomFieldUpsertOption[] {
		return this.customField.options || [];
	}

	protected get CustomFieldDataType(): typeof CustomFieldDataType {
		return CustomFieldDataType;
	}

	// #region Fields
	protected isUpdating: boolean;

	protected applyCurrentDate: boolean;
	protected nowDate: Date = new Date();

	protected dataType: number = this.CustomFieldDataType.number ?? 1;

	protected parentDataType: number;
	protected parentId!: string | undefined;

	private resetSubscription: Subscription;
	private selectedItemId!: string | undefined;
	// #endregion Fields

	// #region Validators
	protected customFieldNameValidators: FrForm.FrFormControlValidator = {
		required: true
	}

	protected customFieldNumberValidators: FrForm.FrFormControlValidator = {};
	// #endregion Validators

	// #region DropDownItems
	protected customFieldDataTypeItems: FrForm.FrInputValueItem<number>[] = [];
	protected customFieldParentItems: FrForm.FrInputValueItem<string | undefined>[] = [];
	protected customFieldInitValueBooleanItems: FrForm.FrInputValueItem<number>[] = [];
	// #endregion DropDownItems

	constructor(elementRef: ElementRef) {
		super(elementRef);

		this.isUpdating = false;
		this.applyCurrentDate = false;
		this.parentDataType = 0;

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

	protected override onDestroy(): void {
		this.resetSubscription.unsubscribe();

		super.onDestroy();
	}

	protected override async onLanguageChange(): Promise<void> {
		this.customFieldDataTypeItems = await this.getCustomFieldDataTypes();
		this.customFieldParentItems = this.getParentCustomFieldItems();

		this.customFieldInitValueBooleanItems = [
			{
				key: this.applicationResource.no,
				value: 0,
				order: 0,
				selectable: true
			},
			{
				key: this.applicationResource.yes,
				value: 1,
				order: 1,
				selectable: true
			}
		];

		setTimeout(async () => {
			const maxValueController = this.form.getFormControlByPresenter("NumberMaxValue");
			if (maxValueController) {
				this.form.addCustomValidator("numberMinValue", { validator: equalOrGreaterValidator(maxValueController), message: this.customFieldResource.minValueCustomErrorMessage });
			}

			super.onLanguageChange();
		});
	}

	// #region Actions
	protected onEditCustomField = (option: CustomFieldUpsertOption): void => {
		if (this.form && option) {
			if (this.selectedItemId === option.uuid) {
				return;
			}

			this.dataType = option.dataType;
			this.isUpdating = true;
			this.selectedItemId = option.uuid;

			const extendedOption: ExtendedCustomFieldUpsertOption = option as ExtendedCustomFieldUpsertOption;
			this.getDataTypeValidation(extendedOption);
			this.getDataTypeInitValue(option, extendedOption);
			this.getDataTypeParentCondition(option, extendedOption);

			setTimeout(async () => {
				await this.form.setModel(extendedOption);
			})
		}
	}

	protected onCancelEditCustomField = async (): Promise<void> => {
		await this.onReset();
	}

	protected onRemoveCustomField = async (): Promise<void> => {
		const options: ExtendedCustomFieldUpsertOption[] = this.customField.options || [];
		const index = options.findIndex(x => x.uuid === this.selectedItemId);

		if (index > -1) {
			options.splice(index, 1);
			this.customField.options = options;
			await this.onReset();
		}
	}

	protected onAddNewCustomField = async (): Promise<void> => {
		if (this.form) {
			const options: ExtendedCustomFieldUpsertOption[] = this.customField.options ?? [];
			const model = await this.form.onSubmit();

			if (model.isValid && model.data) {
				const customField: CustomFieldUpsertOption = {
					uuid: (this.isUpdating && this.selectedItemId) ? this.selectedItemId : uuid(),
					dataType: model.data.dataType,
					name: model.data.name,
					isActive: model.data.isActive,
					helpText: model.data.helpText,
					placeHolder: model.data.placeHolder,
					isRequired: model.data.isRequired,
					customFieldParent: model.data.customFieldParent,
				};

				this.convertModelToCustomFieldOption(model, customField);
				this.convertParentModelToParentCustomFieldOption(model, customField);
				this.createValidationForCustomField(customField);

				if (!this.isUpdating) {
					options.push(customField);
				}
				else {
					const existedCustomField = options.find(x => x.uuid === this.selectedItemId);
					customField.id = existedCustomField?.id;

					if (existedCustomField) {
						const index = options.indexOf(existedCustomField);
						options[index] = customField;
					}
				}

				this.customField.options = options;
				await this.onReset();
			}
		}
	}

	protected onDataTypeChange = async (result: FrForm.FrFormControlChangeResult<number | undefined, Event>): Promise<void> => {
		this.dataType = result.value ?? 0;
	}

	protected onParentDataTypeChange = async (result: FrForm.FrFormControlChangeResult<string | undefined, Event>): Promise<void> => {
		if (!result.value) {
			this.parentDataType = 0;
			return
		}

		const parent = this.getParent(result.value);
		if (!parent) {
			return;
		}

		this.parentDataType = parent.dataType;
	}

	protected onCurrentDateChange = async (): Promise<void> => {
		this.applyCurrentDate = !this.applyCurrentDate;
	}
	// #endregion Actions

	// #region Private Methods
	private getCustomFieldDataTypes = async (): Promise<FrForm.FrInputValueItem<number>[]> => {
		return DropdownHelper.getDropDownItemsFromEnumeration(CustomFieldDataType, 'customFieldDataType');
	}

	private onReset = async (): Promise<void> => {
		this.isUpdating = false;
		this.selectedItemId = undefined;
		this.dataType = this.CustomFieldDataType.number ?? 1;

		this.applyCurrentDate = false;
		this.parentDataType = 0;
		this.parentId = undefined;

		this.customFieldParentItems = this.getParentCustomFieldItems();
		await this.form.onReset();
	}

	private getParent = (parentId: string | undefined | null): ExtendedCustomFieldUpsertOption | undefined => {
		return (this.customField.options ?? []).find(x => x.uuid == parentId);
	}

	private getParentCustomFieldItems = (): FrForm.FrInputValueItem<string | undefined>[] => {
		const options: ExtendedCustomFieldUpsertOption[] = (this.customField.options ?? []);

		return options
			.filter((x: ExtendedCustomFieldUpsertOption) => !this.isUpdating || (this.isUpdating && x.uuid !== this.selectedItemId && x.customFieldParent !== this.selectedItemId))
			.map((x: ExtendedCustomFieldUpsertOption, index: number) => {
				return {
					key: x.name,
					value: x.uuid,
					order: index,
					selectable: x.isActive,
				} as FrForm.FrInputValueItem<string>
			});
	}

	private getDataTypeValidation = (extendedCustomField: ExtendedCustomFieldUpsertOption): void => {
		const validation: CustomFieldOptionValidation = JSON.parse(extendedCustomField.validation || '');

		extendedCustomField.numberMinValue = 0;
		extendedCustomField.numberMaxValue = 9999;
		extendedCustomField.isMultiLine = false;
		extendedCustomField.regex = '';

		switch (extendedCustomField.dataType) {
			case this.CustomFieldDataType.number:
				{
					extendedCustomField.numberMinValue = validation.numberMinValue ?? 0;
					extendedCustomField.numberMaxValue = validation.numberMaxValue ?? 9999;
					break;
				}

			case this.CustomFieldDataType.string:
				{
					extendedCustomField.isMultiLine = validation.isMultiLine;
					extendedCustomField.regex = validation.regex;
					break;
				}

			case this.CustomFieldDataType.date:
				{
					this.applyCurrentDate = validation.applyCurrentDate ?? false;
					extendedCustomField.applyCurrentDate = validation.applyCurrentDate;
					break;
				}

			case this.CustomFieldDataType.boolean: { break; }
		}
	}

	private getDataTypeInitValue = (customField: CustomFieldUpsertOption, extendedCustomField: ExtendedCustomFieldUpsertOption): void => {
		extendedCustomField.initValueNumber = 0;
		extendedCustomField.initValueString = '';
		extendedCustomField.initValueDateTime = this.nowDate;
		extendedCustomField.initValueBoolean = false;

		switch (customField.dataType) {
			case this.CustomFieldDataType.number:
				{
					extendedCustomField.initValueNumber = +(customField.initialValue as number);
					break;
				}

			case this.CustomFieldDataType.string:
				{
					extendedCustomField.initValueString = customField.initialValue as string;
					break;
				}

			case this.CustomFieldDataType.date:
				{
					this.applyCurrentDate = extendedCustomField.applyCurrentDate ?? false;
					extendedCustomField.initValueDateTime = extendedCustomField.applyCurrentDate ? this.nowDate : (customField.initialValue as Date);
					break;
				}

			case this.CustomFieldDataType.boolean:
				{
					extendedCustomField.initValueBoolean = customField.initialValue as boolean;
					break;
				}
		}
	}

	private getDataTypeParentCondition = (customField: CustomFieldUpsertOption, extendedCustomField: ExtendedCustomFieldUpsertOption): void => {
		this.parentDataType = 0;

		extendedCustomField.parentConditionNumber = 0;
		extendedCustomField.parentConditionString = '';
		extendedCustomField.parentConditionDateTime = this.nowDate;
		extendedCustomField.parentConditionBoolean = false;

		const parent = this.getParent(customField.customFieldParent);
		if (!parent) {
			return;
		}

		this.parentDataType = parent.dataType;

		switch (parent.dataType) {
			case this.CustomFieldDataType.number:
				{
					let number = customField.parentCondition as number;
					if (isNaN(number)) {
						number = 0;
					}

					extendedCustomField.parentConditionNumber = number;
					break;
				}

			case this.CustomFieldDataType.string:
				{
					extendedCustomField.parentConditionString = customField.parentCondition as string;
					break;
				}

			case this.CustomFieldDataType.date:
				{
					const tryParse = Date.parse(customField.parentCondition as string);
					let date = this.nowDate;

					if (!isNaN(tryParse)) {
						date = new Date(tryParse);
					}

					extendedCustomField.parentConditionDateTime = date;
					break;
				}

			case this.CustomFieldDataType.boolean:
				{
					extendedCustomField.parentConditionBoolean = customField.parentCondition as boolean;
					break;
				}
		}
	}

	private convertModelToCustomFieldOption = (model: FrForm.FrFormSubmitResult<ExtendedCustomFieldUpsertOption>, customField: CustomFieldUpsertOption): void => {
		if (!model.data) {
			return;
		}

		switch (model.data.dataType) {
			case this.CustomFieldDataType.number:
				{
					customField.numberMinValue = model.data.numberMinValue;
					customField.numberMaxValue = model.data.numberMaxValue;
					customField.initialValue = model.data.initValueNumber;
					break;
				}

			case this.CustomFieldDataType.string:
				{
					customField.regex = model.data.regex;
					customField.isMultiLine = model.data.isMultiLine;
					customField.initialValue = model.data.initValueString;
					break;
				}

			case this.CustomFieldDataType.date:
				{
					customField.applyCurrentDate = model.data.applyCurrentDate;
					customField.initialValue = model.data.initValueDateTime;
					break;
				}

			case this.CustomFieldDataType.boolean:
				{
					customField.initialValue = model.data.initValueBoolean;
					break;
				}
		}
	}

	private convertParentModelToParentCustomFieldOption = (model: FrForm.FrFormSubmitResult<ExtendedCustomFieldUpsertOption>, customField: CustomFieldUpsertOption): void => {
		if (!model.data) {
			return;
		}

		const parent = this.getParent(model.data.customFieldParent);
		if (!parent) {
			return;
		}

		switch (parent.dataType) {
			case this.CustomFieldDataType.number:
				{
					customField.parentCondition = model.data.parentConditionNumber?.toString();
					break;
				}

			case this.CustomFieldDataType.string:
				{
					customField.parentCondition = model.data.parentConditionString?.toString();
					break;
				}

			case this.CustomFieldDataType.date:
				{
					customField.parentCondition = model.data.parentConditionDateTime?.toString();
					break;
				}

			case this.CustomFieldDataType.boolean:
				{
					customField.parentCondition = model.data.parentConditionBoolean?.toString();
					break;
				}
		}
	}

	private createValidationForCustomField = (customField: ExtendedCustomFieldUpsertOption): void => {
		const validation: CustomFieldOptionValidation = {
			isMultiLine: customField.isMultiLine,
			applyCurrentDate: customField.applyCurrentDate,
			numberMaxValue: customField.numberMaxValue,
			numberMinValue: customField.numberMinValue,
			regex: customField.regex,
		};

		customField.validation = JSON.stringify(validation);

		delete customField.isMultiLine;
		delete customField.applyCurrentDate;
		delete customField.numberMaxValue;
		delete customField.numberMinValue;
		delete customField.regex;
	}
	// #endregion Private Methods
}
