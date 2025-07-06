import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { v7 as uuid } from 'uuid';

import { _CustomFieldUpsertBaseComponent } from '../_custom-field-upsert.base.component';
import { betweenControllerValidator, equalOrGreaterControllerValidator } from '../custom-field-validators.component';
import { CustomFieldDataType } from '../../../../generated/api-schematics.generator';
import { CustomField, ValueType } from '../../../../types/custom-field/custom-field-upsert.type';

import { NameFromListPipe } from '../../../../pipes/name-from-list.pipe';

import * as FrForm from '@fr-widget/sdk/form';
import * as FrCard from '@fr-widget/sdk/card';
import * as FrButton from '@fr-widget/sdk/button';

export interface CustomFieldOption {
	id?: number,
	uniqueId?: string;
	isActive: boolean;
	name: string;
	dataType: CustomFieldDataType;
	helpText?: string;
	placeHolder?: string;
	isRequired: boolean;
	initialValueNumber?: number;
	initialValueString?: string;
	initialValueDateTime?: Date;
	initialValueBoolean?: boolean;
	applyCurrentDate?: boolean;
	numberMinValue?: number;
	numberMaxValue?: number;
	isMultiLine?: boolean;
	regex?: string;
	parentId?: number;
	parentUniqueId?: string;
	hasParentCondition?: boolean;
	parentConditionNumber?: number;
	parentConditionString?: string;
	parentConditionDateTime?: Date;
	parentConditionBoolean?: boolean;
}

export interface CustomFieldOptionValidation {
	numberMinValue?: number,
	numberMaxValue?: number,
	isMultiLine?: boolean,
	regex?: string,
	applyCurrentDate?: boolean,
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

	@ViewChild('optionForm') form!: FrForm.FrFormComponent<CustomFieldOption>;

	private _applyCurrentDate: boolean;
	protected set applyCurrentDate(applyCurrentDate: boolean) {
		this._applyCurrentDate = applyCurrentDate;
	}
	protected get applyCurrentDate() {
		return this._applyCurrentDate;
	}

	private _hasParentCondition: boolean;
	protected set hasParentCondition(hasParentCondition: boolean) {
		this._hasParentCondition = hasParentCondition;
	}
	protected get hasParentCondition() {
		console.log('hasParentCondition', this._hasParentCondition);
		return this._hasParentCondition;
	}

	// #region Fields
	protected options: CustomFieldOption[] = [];

	protected isUpdating: boolean;

	protected nowDate: Date = new Date();

	protected selectedParentDataType!: CustomFieldDataType | undefined;
	// protected selectedParentUniqueId!: string | undefined;

	protected selectedDataType: CustomFieldDataType = 1;
	protected selectedUniqueId!: string | undefined;

	private subscription: Subscription;
	private resetSubscription: Subscription;
	// #endregion Fields

	// #region Validators
	protected nameValidators: FrForm.FrFormControlValidator = {
		required: true
	}
	protected numberMinValueValidators: FrForm.FrFormControlValidator = {
		custom: [{
			validator: equalOrGreaterControllerValidator('numberMaxValue'),
			message: this.customFieldResource.minValueCustomErrorMessage,
		}]
	}
	protected initialValueNumberValidators: FrForm.FrFormControlValidator = {
		custom: [{
			validator: betweenControllerValidator('numberMinValue', 'numberMaxValue'),
			message: this.customFieldResource.initialValueNumberCustomErrorMessage,
		}]
	}
	// #endregion Validators

	// #region DropDownItems
	protected dataTypeItems: FrForm.FrInputValueItem<number>[] = [];
	protected parentItems: FrForm.FrInputValueItem<string | undefined>[] = [];
	protected initialValueBooleanItems: FrForm.FrInputValueItem<number>[] = [];
	// #endregion DropDownItems

	constructor(elementRef: ElementRef) {
		super(elementRef);

		this.isUpdating = false;

		this._applyCurrentDate = false;
		this._hasParentCondition = true;

		this.subscription = this.applicationDocumentService
			.formValidation
			.subscribe(async () => {
				if (this.form) {
					this.applicationDocumentService.addResult(this.form.id, true);
					this.customFieldService.customFieldGroup.customFields = this.options.map((x: CustomFieldOption) => {
						return ({
							dataType: x.dataType,
							isActive: x.isActive,
							name: x.name,
							isRequired: x.isRequired,
							uniqueId: x.uniqueId,
							helpText: x.helpText,
							placeHolder: x.placeHolder,
							parentUniqueId: x.parentUniqueId,
							hasParentCondition: x.hasParentCondition,
							validation: this.getDataTypeValidation(x),
							initialValue: this.getDataTypeInitValue(x),
							parentCondition: this.getDataTypeParentCondition(x),
						} as CustomField);
					});
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

	protected override onInit(): void {
		//this.customValidation();
		super.onInit();
	}

	protected override afterViewInit(): void {
		const customFields: CustomField[] = this.customFieldService.customFieldGroup.customFields;
		customFields.forEach((customField: CustomField) => {
			const option: CustomFieldOption = {
				id: customField.id,
				uniqueId: customField.uniqueId,
				isActive: customField.isActive,
				name: customField.name,
				dataType: customField.dataType,
				helpText: customField.helpText,
				placeHolder: customField.placeHolder,
				isRequired: customField.isRequired,
			};

			this.setDataTypeValidation(option, customField);
			this.setDataTypeInitValue(option, customField);

			if (customField.parentId) {
				const parent = customFields.find(x => x.id == customField.parentId);
				if (parent) {
					option.parentId = customField.parentId;
					option.parentUniqueId = parent.uniqueId;

					this.setDataTypeParentCondition(option, parent, customField);
				}
			}

			this.options.push(option);
		})
	}

	protected override onDestroy(): void {
		this.subscription.unsubscribe();
		this.resetSubscription.unsubscribe();

		super.onDestroy();
	}

	protected override async onLanguageChange(): Promise<void> {
		await this.setDataTypeItems();

		this.setBooleanItems();
		this.setParentItems();

		setTimeout(async () => {
			super.onLanguageChange();
		});
	}

	// #region Actions
	protected onAddNew = async (): Promise<void> => {
		if (this.form) {
			const model = await this.form.onSubmit();
			const { isValid, data } = model;

			if (isValid && data) {

				if (this.isUpdating) {
					const itemIndex = this.options.findIndex(x => x.uniqueId === this.selectedUniqueId);
					if (itemIndex < 0) {
						await this.onReset();
						return;
					}

					data.uniqueId = this.selectedUniqueId;

					this.options[itemIndex] = data;
					await this.onReset();
					return;
				}

				data.uniqueId = uuid();

				this.options.push(data);
				await this.onReset();
			}
		}
	}

	protected onEdit = (customField: CustomFieldOption): void => {
		if (this.form && customField) {
			if (this.selectedUniqueId === customField.uniqueId) {
				return;
			}

			this.isUpdating = true;

			this.selectedUniqueId = customField.uniqueId;
			this.selectedDataType = customField.dataType;

			this.applyCurrentDate = customField.applyCurrentDate ?? false;
			this.hasParentCondition = customField.hasParentCondition ?? true;

			if (this.applyCurrentDate) {
				customField.initialValueDateTime = this.nowDate;
			}

			this.setParentItems();
			this.setParentDataType(customField.parentUniqueId);

			setTimeout(async () => {
				console.log('customField', customField);
				await this.form.setModel(customField);
			})
		}
	}

	protected onCancelEdit = async (): Promise<void> => {
		await this.onReset();
	}

	protected onRemove = async (): Promise<void> => {
		const itemIndex = this.options.findIndex(x => x.uniqueId === this.selectedUniqueId);
		if (itemIndex < 0) {
			await this.onReset();
			return;
		}

		this.options.splice(itemIndex, 1);
		await this.onReset();
		return;
	}

	protected onDataTypeChange = async (result: FrForm.FrFormControlChangeResult<number | undefined, Event>): Promise<void> => {
		this.selectedDataType = result.value as CustomFieldDataType ?? 0;
	}

	protected onParentDataTypeChange = async (result: FrForm.FrFormControlChangeResult<string | undefined, Event>): Promise<void> => {
		this.hasParentCondition = true;
		this.setParentDataType(result.value || undefined);
	}

	protected onCurrentDateChange = async (): Promise<void> => {
		this.applyCurrentDate = !this.applyCurrentDate;
	}

	protected onParentConditionChange = async (): Promise<void> => {
		this.hasParentCondition = !this.hasParentCondition;
	}
	// #endregion Actions

	// #region Private Methods
	private onReset = async (): Promise<void> => {
		this.isUpdating = false;

		this.selectedDataType = 1 as CustomFieldDataType;
		this.selectedUniqueId = undefined;

		this.applyCurrentDate = false;
		this.hasParentCondition = true;

		this.setParentItems();
		this.setParentDataType(undefined);

		await this.form.onReset();

		setTimeout(async () => {
			await this.form.setModel({
				name: '',
				isRequired: false,
				isActive: true,
				dataType: 1,
				hasParentCondition: true,
				applyCurrentDate: false,
				initialValueDateTime: this.nowDate,
			});
		});
	}

	private setDataTypeItems = async (): Promise<void> => {
		const groupTypes = this.applicationLocalizationService.resource.enumResources.customFieldDataType;
		this.dataTypeItems = [{
			key: groupTypes.number,
			value: 1 as CustomFieldDataType,
			order: 1,
			selectable: true,
		},
		{
			key: groupTypes.string,
			value: 2 as CustomFieldDataType,
			order: 2,
			selectable: true
		},
		{
			key: groupTypes.date,
			value: 3 as CustomFieldDataType,
			order: 3,
			selectable: true
		},
		{
			key: groupTypes.boolean,
			value: 4 as CustomFieldDataType,
			order: 3,
			selectable: true
		}];
	}

	private setBooleanItems = (): void => {
		this.initialValueBooleanItems = [
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
	}

	private setParentItems = (): void => {
		const customFields: CustomFieldOption[] = this.options;

		this.parentItems = customFields
			.filter((x: CustomFieldOption) => !this.isUpdating || (this.isUpdating && x.uniqueId !== this.selectedUniqueId && x.parentUniqueId !== this.selectedUniqueId))
			.map((x: CustomFieldOption, index: number) => {
				return {
					key: x.name,
					value: x.uniqueId,
					order: index,
					selectable: x.isActive,
				} as FrForm.FrInputValueItem<string>
			});;
	}

	private setParentDataType = (uniqueId: string | undefined): void => {
		if (!uniqueId) {
			this.selectedParentDataType = undefined;
			return
		}

		const parent = this.options.find(x => x.uniqueId == uniqueId);
		if (!parent) {
			return;
		}

		this.selectedParentDataType = parent.dataType;
	}

	// #region DataTypeValidation
	private getDataTypeValidation = (customField: CustomFieldOption): string | undefined => {
		switch (customField.dataType) {
			case 1:
				{
					const validation: CustomFieldOptionValidation = {
						numberMinValue: customField.numberMinValue,
						numberMaxValue: customField.numberMaxValue,
					}

					return JSON.stringify(validation);
				}

			case 2:
				{
					const validation: CustomFieldOptionValidation = {
						isMultiLine: customField.isMultiLine ?? false,
						regex: customField.regex,
					};

					return JSON.stringify(validation);
				}

			case 3:
				{
					const validation: CustomFieldOptionValidation = {
						applyCurrentDate: customField.applyCurrentDate ?? false,
					};

					return JSON.stringify(validation);
				}

			case 4:
				{
					return '';
				}

			default:
				{
					throw new Error('NOT SUPPORTED TYPE');
				}
		}
	}

	private setDataTypeValidation = (option: CustomFieldOption, customField: CustomField): void => {
		if (customField.validation === undefined) {
			return;
		}

		const validation: CustomFieldOptionValidation = JSON.parse(customField.validation);

		switch (customField.dataType) {
			case 1:
				{
					option.numberMinValue = validation.numberMinValue;
					option.numberMaxValue = validation.numberMaxValue;
					break;
				}

			case 2:
				{
					option.isMultiLine = validation.isMultiLine;
					option.regex = validation.regex;
					break;
				}

			case 3:
				{
					option.applyCurrentDate = validation.applyCurrentDate;
					break;
				}

			case 4:
				{
					break;
				}

			default:
				{
					throw new Error('NOT SUPPORTED TYPE');
				}
		}
	}
	// #endregion DataTypeValidation

	// #region DataTypeInitValue
	private getDataTypeInitValue = (customField: CustomFieldOption): ValueType | undefined => {
		switch (customField.dataType) {
			case 1:
				{
					return customField.initialValueNumber ? +(customField.initialValueNumber) : undefined;
				}

			case 2:
				{
					return customField.initialValueString;
				}

			case 3:
				{
					this.applyCurrentDate = customField.applyCurrentDate ?? false;
					return customField.applyCurrentDate ? this.nowDate : customField.initialValueDateTime;
				}

			case 4:
				{
					return customField.initialValueBoolean;
				}

			default:
				{
					throw new Error('NOT SUPPORTED TYPE');
				}
		}
	}

	private setDataTypeInitValue = (option: CustomFieldOption, customField: CustomField): void => {
		if (customField.initialValue === undefined) {
			return;
		}

		switch (customField.dataType) {
			case 1:
				{
					option.initialValueNumber = customField.initialValue as number;
					break;
				}

			case 2:
				{
					option.initialValueString = customField.initialValue as string;
					break;
				}

			case 3:
				{
					option.initialValueDateTime = option.applyCurrentDate ? this.nowDate : customField.initialValue as Date;
					break;
				}

			case 4:
				{
					option.initialValueBoolean = customField.initialValue as boolean;
					break;
				}

			default:
				{
					throw new Error('NOT SUPPORTED TYPE');
				}
		}
	}
	// #endregion DataTypeInitValue

	// #region DataTypeParentCondition
	private getDataTypeParentCondition = (customField: CustomFieldOption): ValueType | undefined => {
		const parent = this.options.find(x => x.uniqueId == customField.parentUniqueId);
		if (!parent) {
			return undefined;
		}

		this.selectedParentDataType = parent.dataType;

		switch (parent.dataType) {
			case 1:
				{
					return customField.parentConditionNumber;
				}

			case 2:
				{
					return customField.parentConditionString;
				}

			case 3:
				{
					return customField.parentConditionDateTime;
				}

			case 4:
				{
					return customField.parentConditionBoolean;
				}

			default:
				{
					throw new Error('NOT SUPPORTED TYPE');
				}
		}
	}

	private setDataTypeParentCondition = (option: CustomFieldOption, parent: CustomField, customField: CustomField): void => {
		if (customField.parentCondition === undefined) {
			return;
		}

		switch (parent.dataType) {
			case 1:
				{
					option.parentConditionNumber = customField.parentCondition as number;
					break;
				}

			case 2:
				{
					option.parentConditionString = customField.parentCondition as string;
					break;
				}

			case 3:
				{
					option.parentConditionDateTime = customField.parentCondition as Date;
					break;
				}

			case 4:
				{
					option.parentConditionBoolean = customField.parentCondition as boolean;
					break;
				}

			default:
				{
					throw new Error('NOT SUPPORTED TYPE');
				}
		}
	}
	// #endregion DataTypeParentCondition
	// #endregion Private Methods
}
