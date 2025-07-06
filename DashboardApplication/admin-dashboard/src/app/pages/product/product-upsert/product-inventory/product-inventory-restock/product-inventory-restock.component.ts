import { Component, ElementRef, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { _ProductUpsertBaseComponent } from '../../_product-upsert.base.component';
import { ProductUpsertRestock } from '../../../../../types/product/product-upsert.type';

import * as FrForm from '@fr-widget/sdk/form';

@Component({
	selector: 'product-inventory-restock',
	standalone: true,
	imports: [
		FrForm.FrFormComponent,
		FrForm.FrFormControlComponent,
		FrForm.FrFormGroupComponent,
		FrForm.FrFormControlDirectiveModule,
	],
	templateUrl: './product-inventory-restock.component.html',
	encapsulation: ViewEncapsulation.None,
})
export class ProductInventoryRestockComponent extends _ProductUpsertBaseComponent {

	@ViewChild('productInventoryRestockForm') form!: FrForm.FrFormComponent<ProductUpsertRestock>;

	@Output() protected validate: EventEmitter<boolean> = new EventEmitter<boolean>();

	private subscription: Subscription;

	// TODO - NEEDS TO GET DATA FROM DATABASE
	protected currentQuantity: number;
	protected deliveryQuantity: number;
	protected overallQuantity: number;
	protected restockedLastTime: string;

	// #region Validators
	protected productQuantityValidators: FrForm.FrFormControlValidator = {
		required: true
	};
	// #endregion Validators

	constructor(elementRef: ElementRef) {
		super(elementRef);

		this.currentQuantity = 0
		this.deliveryQuantity = 0
		this.overallQuantity = 0
		this.restockedLastTime = '--'

		this.subscription = this.applicationDocumentService
			.formValidation
			.subscribe(async () => {
				if (this.form) {
					const model = await this.form.onSubmit();
					this.applicationDocumentService.addResult(this.form.id, model.isValid);
					this.validate.emit(model.isValid);

					if (model.isValid && model.data) {
						this.product.quantity = model.data.quantity || 0;
					}
				}
			});
	}

	protected override async afterViewInit(): Promise<void> {
		const model: ProductUpsertRestock = {
			quantity: this.product.quantity || 0,
		};
		await this.form.setModel(model);
	}

	protected override onDestroy(): void {
		this.subscription.unsubscribe();

		super.onDestroy();
	}
}
