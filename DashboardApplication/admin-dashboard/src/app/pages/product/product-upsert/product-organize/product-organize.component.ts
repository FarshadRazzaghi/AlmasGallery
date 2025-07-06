import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { _ProductUpsertBaseComponent } from '../_product-upsert.base.component';
import { ProductUpsertOrganize } from '../../../../types/product/product-upsert.type';
import { CustomFieldRequest } from '../../../../types/custom-field/custom-field-request.type';

import * as FrForm from '@fr-widget/sdk/form';

@Component({
	selector: 'product-organize',
	standalone: true,
	imports: [
		FrForm.FrFormComponent,
		FrForm.FrFormControlComponent,
		FrForm.FrFormGroupComponent,
		FrForm.FrFormControlDirectiveModule,
	],
	templateUrl: './product-organize.component.html',
	encapsulation: ViewEncapsulation.None
})
export class ProductOrganizeComponent extends _ProductUpsertBaseComponent {

	@ViewChild('productOrganizationForm') form!: FrForm.FrFormComponent<ProductUpsertOrganize>;

	constructor(elementRef: ElementRef) {
		super(elementRef);

		this.productCategoryLoading = true;

		this.subscription = this.applicationDocumentService
			.formValidation
			.subscribe(async () => {
				if (this.form) {
					const model = await this.form.onSubmit();
					this.applicationDocumentService.addResult(this.form.id, model.isValid);

					if (model.isValid && model.data) {
						this.product.vendorId = model.data.vendorId;
						this.product.categoryId = model.data.categoryId;
						this.product.collectionId = model.data.collectionId;
						this.product.tags = model.data.tags;
					}
				}
			});
	}

	// #region Properties
	protected get productCategoryHelpText(): string {
		return `<a class="btn-link btn-link-primary align-self-center mx-1 px-1" target="_blank" href="/product-categories/add" title="${this.productResource.addNewCategory}">${this.productResource.addNewCategory}</a>`;
	}
	// #endregion Properties

	// #region Fields
	protected productCategoryLoading: boolean;

	private subscription: Subscription;
	// #endregion Fields

	// #region Validators
	protected productVendorValidators: FrForm.FrFormControlValidator = {
		required: true,
	};
	protected productCategoryValidators: FrForm.FrFormControlValidator = {
		required: true,
	};
	protected productCollectionValidators: FrForm.FrFormControlValidator = {};
	protected productPublishStatusValidators: FrForm.FrFormControlValidator = {
		required: true,
	};
	protected productTagsValidators: FrForm.FrFormControlValidator = {
		required: true
	};
	// #endregion Validators

	//#region DropDownItems
	protected productCategoryItems: FrForm.FrInputValueItem<number>[] = [];
	protected ProductVendorItems: FrForm.FrInputValueItem<number>[] = [{
		key: 'الماس گالری',
		value: 1,
		order: 0,
		selectable: true
	}];
	//#endregion DropDownItems

	// #region Overrides
	protected override async afterViewInit(): Promise<void> {
		await this.getProductCategoryItems();

		const model: ProductUpsertOrganize = {
			tags: this.product.tags || [],
			categoryId: this.product.categoryId || 1,
			vendorId: this.product.vendorId || 1,
			collectionId: this.product.collectionId,
		};
		await this.form.setModel(model);
	}

	protected override onDestroy(): void {
		this.subscription.unsubscribe();

		super.onDestroy();
	}

	protected override async onLanguageChange(): Promise<void> {
		super.onLanguageChange();
	}
	// #endregion Overrides

	// #region Actions
	protected onRefreshProductCategory = async (): Promise<void> => {
		await this.getProductCategoryItems();
	}

	protected onChangeProductCategory = async (event: FrForm.FrFormControlChangeResult<number, Event>): Promise<void> => {
		await this.getCustomFieldsForProductCategoryItems(event.value || 0);
	}
	// #endregion Actions

	// #region Private Methods
	private getProductCategoryItems = async (): Promise<void> => {
		let data: { id: number, name: string }[] = [];
		this.productCategoryLoading = true;

		const items = await this.productService.productCategoryHttpService.getProductCategoriesForDropdown();
		if (items.status) {
			data = (items.data ?? [])
				.map(x => {
					return {
						id: x.key || 0,
						name: x.value,
					}
				});
		}

		setTimeout(async () => {
			this.productCategoryItems = data.map((x, index) => {
				return {
					key: x.name,
					value: x.id,
					order: index,
					selectable: true
				};
			});

			if (this.productCategoryItems.length > 0) {
				await this.getCustomFieldsForProductCategoryItems(this.productCategoryItems[0].value || 0);
			}

			this.productCategoryLoading = false;
		})
	}

	private getCustomFieldsForProductCategoryItems = async (productCategoryId: number): Promise<void> => {
		if (productCategoryId === 0) return;

		let data: CustomFieldRequest[] = [];
		this.productCategoryLoading = true;

		const items = await this.productService.customFieldGroupHttpService.getListForProductCategory(productCategoryId, true);
		if (items.status) {
			data = (items.data ?? []);
		}

		setTimeout(() => {
			this.productCategoryLoading = false;
			this.productService.customFields = data;

			console.log(this.productService.customFields);
		})
	}

	private onReset = async (): Promise<void> => {
		await this.form.onReset();
	}
	// #endregion Private Methods
}
