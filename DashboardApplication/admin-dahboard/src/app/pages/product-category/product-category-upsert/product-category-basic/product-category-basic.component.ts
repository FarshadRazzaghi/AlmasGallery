import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { _ProductCategoryUpsertBaseComponent } from '../_product-category-upsert.base.component';
import { ProductCategoryUpsertBasic } from '../../../../types/product-category/product-category-upsert.type';

import * as FrForm from '@fr-widget/sdk/form';

@Component({
	selector: 'product-category-basic',
	standalone: true,
	imports: [
		FrForm.FrFormComponent,
		FrForm.FrFormControlComponent,
		FrForm.FrFormControlDirectiveModule,
	],
	templateUrl: './product-category-basic.component.html',
	encapsulation: ViewEncapsulation.None
})
export class ProductCategoryBasicComponent extends _ProductCategoryUpsertBaseComponent {

	@ViewChild('productCategoryBasicForm') form!: FrForm.FrFormComponent<ProductCategoryUpsertBasic>;

	// #region Fields
	protected productCategoryParentLoading: boolean;

	private subscription: Subscription;
	private resetSubscription: Subscription;
	// #endregion Fields

	// #region Validators
	protected productCategoryNameValidators: FrForm.FrFormControlValidator = {
		required: true
	}
	protected productCategoryParentValidators: FrForm.FrFormControlValidator = {}
	protected productCategoryDescriptionValidators: FrForm.FrFormControlValidator = {
		required: true,
	};
	// #endregion Validators

	//#region DropDownItems
	protected productCategoryParentItems: FrForm.FrInputValueItem<number>[] = [];
	//#endregion DropDownItems

	protected productCategoryDescriptionToolbarOptions: FrForm.FrEditorToolbar = {
		textFormat: {
			bold: true,
			italic: true,
			underLine: true,
			strikeLine: true,
		},
		listFormat: {
			bulletOrder: true,
			numberOrder: true,
		},
		cleanFormat: true,
	};

	constructor(elementRef: ElementRef) {
		super(elementRef);

		this.productCategoryParentLoading = true;

		this.subscription = this.applicationDocumentService
			.formValidation
			.subscribe(async () => {
				if (this.form) {
					const model = await this.form.onSubmit();
					this.applicationDocumentService.addResult(this.form.id, model.isValid);

					if (model.isValid && model.data) {
						this.productCategory.name = model.data.name;
						this.productCategory.description = model.data.description;
						this.productCategory.parentId = model.data.parentId;
					}
				}
			})

		this.resetSubscription = this.productCategoryService
			.productCategoryReset
			.subscribe(option => {
				if (this.form && option) {
					setTimeout(async () => {
						await this.onReset();
					})
				}
			})
	}

	protected override async afterViewInit(): Promise<void> {
		await this.getProductCategoryParentItems();

		const model: ProductCategoryUpsertBasic = {
			name: this.productCategory.name,
			description: this.productCategory.description,
			parentId: this.productCategory.parentId
		};

		await this.form.setModel(model);
	}

	protected override onDestroy(): void {
		this.subscription.unsubscribe();
		this.resetSubscription.unsubscribe();

		super.onDestroy();
	}

	// #region Private Methods
	private getProductCategoryParentItems = async (): Promise<void> => {
		console.log('productCategory.id', this.productCategory.id);

		let data: { id: number, name: string }[] = [];
		this.productCategoryParentLoading = true;

		const items = await this.productCategoryService.httpService.getList({ includeCustomFieldGroups: false });
		if (items.status) {
			data = (items.data ?? [])
				.filter(x => x.id !== this.productCategory.id)
				.map(x => {
					return {
						id: x.id || 0,
						name: x.name,
					}
				});
		}

		setTimeout(() => {
			this.productCategoryParentLoading = false;
			this.productCategoryParentItems = data.map((x, index) => {
				return {
					key: x.name,
					value: x.id,
					order: index,
					selectable: true
				};
			});
		})
	}

	private onReset = async (): Promise<void> => {
		await this.form.onReset();
	}
	// #endregion Private Methods
}
