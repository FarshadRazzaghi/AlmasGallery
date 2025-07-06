import { Component, ElementRef, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { Subscription } from 'rxjs';
//import { v7 as uuid } from 'uuid';

import { CustomFieldGroupsHttpService } from '../../../../generated/services/custom-field-groups.service.generator';
import { _ProductCategoryUpsertBaseComponent } from '../_product-category-upsert.base.component';
//import { NameFromListPipe } from '../../../../pipes/name-from-list.pipe';
import { ProductCategoryCustomFieldGroupRequest } from '../../../../generated/api-schematics.generator';

import * as FrForm from '@fr-widget/sdk/form';
import * as FrCard from '@fr-widget/sdk/card';
import * as FrButton from '@fr-widget/sdk/button';

@Component({
	selector: 'product-category-custom-field',
	standalone: true,
	imports: [
		//NameFromListPipe,

		FrForm.FrFormComponent,
		FrForm.FrFormControlComponent,
		FrForm.FrFormGroupComponent,
		FrForm.FrFormControlDirectiveModule,

		FrCard.FrCardComponent,

		FrButton.FrButtonDirective
	],
	templateUrl: './product-category-custom-field.component.html',
	encapsulation: ViewEncapsulation.None
})
export class ProductCategoryCustomFieldComponent extends _ProductCategoryUpsertBaseComponent {

	@ViewChild('productCategoryCustomFieldGroupForm') form!: FrForm.FrFormComponent<ProductCategoryCustomFieldGroupRequest>;
	private customFieldHttpService: CustomFieldGroupsHttpService = inject(CustomFieldGroupsHttpService);

	protected get customFieldGroups(): ProductCategoryCustomFieldGroupRequest[] {
		return this.productCategory.customFieldGroups || [];
	}

	protected get productCategoryCustomFieldGroupHelpText(): string {
		return `<a class="btn-link btn-link-primary align-self-center mx-1 px-1" target="_blank" href="/custom-fields/add" title="${this.productCategoryResource.addNewCustomField}">${this.productCategoryResource.addNewCustomField}</a>`;
	}

	// #region Fields
	protected productCategoryCustomFieldGroupLoading: boolean;
	protected customFieldGroupValue: number;

	private resetSubscription: Subscription;
	// #endregion Fields

	// #region Validators
	protected productCategoryCustomFieldGroupValidators: FrForm.FrFormControlValidator = {
		required: true
	}

	protected productCategoryCustomFieldLocationValidators: FrForm.FrFormControlValidator = {
		required: true
	}
	// #endregion Validators

	// #region DropDownItems
	protected productCategoryCustomFieldLocationItems: FrForm.FrInputValueItem<number>[] = [];
	protected productCategoryCustomFieldGroupItems: FrForm.FrInputValueItem<number>[] = [];
	// #endregion DropDownItems

	constructor(elementRef: ElementRef) {
		super(elementRef);

		this.productCategoryCustomFieldGroupLoading = true;
		this.customFieldGroupValue = 0;

		this.resetSubscription = this.productCategoryService
			.productCategoryReset
			.subscribe(option => {
				console.log(option);
			})
	}

	protected override async onInit(): Promise<void> {
		await this.getCustomFieldGroupItems();
	}

	protected override onDestroy(): void {
		this.resetSubscription.unsubscribe();
		this.changeLanguageSubscription.unsubscribe();

		super.onDestroy();
	}

	protected override async onLanguageChange(): Promise<void> {
		this.productCategoryCustomFieldLocationItems = await this.getCustomFieldGroupLocationTypes();

		super.onLanguageChange();
	}

	// #region Actions
	protected onAddNewCustomFieldGroup = async (): Promise<void> => {
		if (this.form) {
			const customFieldGroups: ProductCategoryCustomFieldGroupRequest[] = this.productCategory.customFieldGroups ?? [];
			const model = await this.form.onSubmit();

			if (model.isValid && model.data) {
				// TODO - NEEDS TO BE FIXED
				// const existed = customFieldGroups.find(x => x.customFieldGroup == model.data?.customFieldGroup);
				// if (existed) {
				// 	throw new Error('duplicated customField group');
				// }

				const customField: ProductCategoryCustomFieldGroupRequest = {
					// TODO - NEEDS TO BE FIXED
					//uuid: uuid(),
					//customFieldGroup: model.data.customFieldGroup,
					//customFieldLocation: model.data.customFieldLocation,
					isActive: model.data.isActive,
				};

				customFieldGroups.push(customField);
				this.productCategory.customFieldGroups = customFieldGroups;

				await this.onReset();
			}
		}
	}

	protected onRemoveCustomFieldGroup = (/*option: ProductCategoryCustomFieldGroupRequest*/): void => {
		// TODO - NEEDS TO BE FIXED
		// const existedIndex = this.customFieldGroups.findIndex(x => x.uuid == option.uuid);
		// if (existedIndex > -1) {
		// 	this.customFieldGroups.splice(existedIndex, 1);
		// }
	}

	protected onRefreshCustomFieldGroup = async (): Promise<void> => {
		await this.getCustomFieldGroupItems();
	}
	// #endregion Actions

	// #region Private Methods
	private getCustomFieldGroupLocationTypes = async (): Promise<FrForm.FrInputValueItem<number>[]> => {
		return [];
		// TODO - NEEDS TO BE FIXED
		// return DropdownHelper.getDropDownItemsFromEnumeration(typeof CustomFieldGroupLocationType, 'customFieldGroupLocationType');
	}

	private getCustomFieldGroupItems = async (): Promise<void> => {
		let data: { id: number, name: string }[] = [];
		this.productCategoryCustomFieldGroupLoading = true;

		const items = await this.customFieldHttpService.getAllCustomFieldGroups(false, [1]);
		if (items.status) {
			data = (items.data ?? [])
				.map(x => {
					return {
						id: x.id || 0,
						name: x.name ?? '---',
					}
				});
		}

		setTimeout(() => {
			this.productCategoryCustomFieldGroupLoading = false;
			this.productCategoryCustomFieldGroupItems = data.map((x, index) => {
				return {
					key: x.name,
					value: x.id,
					order: index,
					selectable: true
				};
			});

			if (this.productCategoryCustomFieldGroupItems.length > 0) {
				this.customFieldGroupValue = this.productCategoryCustomFieldGroupItems[0].value ?? 0;
			}
		})
	}

	private onReset = async (): Promise<void> => {
		if (this.productCategoryCustomFieldGroupItems.length > 0) {
			this.customFieldGroupValue = this.productCategoryCustomFieldGroupItems[0].value ?? 0;
		}

		await this.form.setModel({
			// TODO - NEEDS TO BE FIXED
			//customFieldGroup: this.customFieldGroupValue,
			//customFieldLocation: 1,
			//uuid: '',
			isActive: true,
		});

		await this.form.onReset();
	}
	// #endregion Private Methods
}
