import { Component, ElementRef, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { _ProductCategoryBaseComponent } from '../_product-category.base.component';
import { HeaderActionButton } from '../../../types/button.interface';

import { ProductCategoryHttpService } from '../../../services/http/product-category/product-category.http.service';
import { ProductCategoryUpsert, convertToModel } from '../../../types/product-category/product-category-upsert.type';

import * as FrCard from '@fr-widget/sdk/card';
import * as FrDataGrid from '@fr-widget/sdk/data-grid';

@Component({
	selector: 'product-category-list',
	standalone: true,
	imports: [
		RouterLink,
		FrCard.FrCardComponent,
		FrCard.FrCardHeaderComponent,
		FrCard.FrCardFooterComponent,

		FrDataGrid.FrDataGridComponent,
	],
	templateUrl: './product-category-list.component.html',
	encapsulation: ViewEncapsulation.None
})
export class ProductCategoryListComponent extends _ProductCategoryBaseComponent {

	@ViewChild('productCategoryListDataGrid') dataGrid!: FrDataGrid.FrDataGridComponent<ProductCategoryUpsert>;

	protected productCategoryHttpService: ProductCategoryHttpService = inject(ProductCategoryHttpService);

	protected get actionButtons(): HeaderActionButton[] {
		const actionButtons: HeaderActionButton[] = [
			{
				directive: 'link',
				color: 'primary',
				identifierName: 'AddNewProductCategory',
				text: '',
				isVisible: true,
				isEnable: true,
				target: '_self',
				isExternalLink: false,
				routeLink: '/product-categories/add'
			}
		];

		Object.defineProperties(actionButtons.find(x => x.identifierName === 'AddNewProductCategory'), {
			text: {
				get: () => { return this.applicationLocalizationService.resource.routingResource.productCategoriesAdd; }
			}
		});

		return actionButtons;
	}

	protected get columns(): FrDataGrid.FrDataGridColumn[] {
		return [];
	}

	constructor(elementRef: ElementRef) {
		super(elementRef);
	}

	protected override onInit(): void {
		this.applicationDocumentService.setButtons(this.actionButtons);
	}

	protected override async afterViewInit(): Promise<void> {
		const list = await this.productCategoryHttpService.getList();
		if (list.status) {
			const model = (list.data ?? []).map(a => convertToModel(a));
			setTimeout(() => {
				this.dataGrid.setRecords(model);
			})
		}
	}
}
