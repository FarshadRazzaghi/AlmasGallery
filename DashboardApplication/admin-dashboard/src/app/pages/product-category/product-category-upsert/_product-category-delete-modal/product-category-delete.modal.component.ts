import { Component, Input, OnDestroy, inject } from '@angular/core';
import { FrModalComponent, FrModalService, FrModalSize } from '@fr-widget/sdk/modal';
import { Subscription } from 'rxjs';

import { Resource } from '../../../../_i18n/resource/resource';
import { LocalizationService } from '../../../../services/localization.service';
import { ProductCategoryService } from '../../product-category.service';

@Component({
	selector: 'product-category-delete-modal',
	standalone: true,
	imports: [FrModalComponent],
	templateUrl: './product-category-delete.modal.component.html',
})
export class ProductCategoryDeleteModalComponent implements OnDestroy {

	protected get applicationResource(): Resource {
		return this.applicationLocalizationService.resource;
	}

	protected get ModalSize(): typeof FrModalSize {
		return FrModalSize;
	}

	@Input() public errorMessage: string;
	@Input() public errorStack: string;
	@Input({ required: true }) public id: string;

	private modalService: FrModalService = inject(FrModalService);
	private productCategoryService: ProductCategoryService = inject(ProductCategoryService);
	private applicationLocalizationService: LocalizationService = inject(LocalizationService);

	private subscription: Subscription;

	constructor() {

		this.id = 'custom-field-delete';
		this.errorMessage = '';
		this.errorStack = '';

		this.subscription = this.modalService
			.onModalSubmit
			.subscribe(async () => {
				const productCategoryId = this.productCategoryService.productCategory.id;
				if (productCategoryId) {
					this.modalService.setModalLoading(this.id, true);
					const httpResponse = await this.productCategoryService.httpService.deleteProductCategoryById(productCategoryId);

					if (httpResponse.status) {
						this.modalService.closeModal(this.id);
						this.productCategoryService.deleteProductCategory(true);
						return
					}

					setTimeout(() => {
						this.modalService.setModalLoading(this.id, false);
					})
				}
			})
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
