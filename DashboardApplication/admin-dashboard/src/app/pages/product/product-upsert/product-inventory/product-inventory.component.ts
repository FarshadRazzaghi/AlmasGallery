import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { _ProductUpsertBaseComponent } from '../_product-upsert.base.component';

import { ProductInventoryRestockComponent } from './product-inventory-restock/product-inventory-restock.component';

import { ProductInventoryShippingComponent } from './product-inventory-shipping/product-inventory-shipping.component';
import { ProductInventoryGlobalDeliveryComponent } from './product-inventory-global-delivery/product-inventory-global-delivery.component';
import { ProductInventoryAttributeComponent } from './product-inventory-attribute/product-inventory-attribute.component';
import { ProductInventoryAdvancedComponent } from './product-inventory-advanced/product-inventory-advanced.component';

import * as FrTab from '@fr-widget/sdk/tab'

@Component({
	selector: 'product-inventory',
	standalone: true,
	imports: [
		FrTab.FrTabComponent,
		FrTab.FrTabItemComponent,

		ProductInventoryRestockComponent,
		ProductInventoryShippingComponent,
		ProductInventoryGlobalDeliveryComponent,
		ProductInventoryAttributeComponent,
		ProductInventoryAdvancedComponent,
	],
	templateUrl: './product-inventory.component.html',
	encapsulation: ViewEncapsulation.None,
})
export class ProductInventoryComponent extends _ProductUpsertBaseComponent {

	@ViewChild('productInventoryTab') tab!: FrTab.FrTabComponent;

	constructor(private sanitizer: DomSanitizer, elementRef: ElementRef) {
		super(elementRef);
	}

	// #region Properties
	protected get restockTitle(): SafeHtml {
		return this.getTabTitle(this.productResource.restock, 'ri-box-3-line');
	}

	protected get shippingTitle(): SafeHtml {
		return this.getTabTitle(this.productResource.shipping, 'ri-truck-line');
	}

	protected get globalDeliveryTitle(): SafeHtml {
		return this.getTabTitle(this.productResource.globalDelivery, 'ri-global-line');
	}

	protected get attributesTitle(): SafeHtml {
		return this.getTabTitle(this.productResource.attributes, 'ri-links-line');
	}

	protected get advancedTitle(): SafeHtml {
		return this.getTabTitle(this.productResource.advanced, 'ri-lock-2-fill');
	}

	protected get customFields(): any {
		return this.productService.customFields;
		//.filter(x => x.location == CustomFieldGroupLocationType.descriptionSection)
	}
	// #endregion Properties

	// #region Fields
	private tabResult: { tabNumber: number, result: boolean }[] = [];
	// #endregion Fields

	// #region Actions
	protected onValidate = ($event: boolean, tabNumber: number): void => {
		const index = this.tabResult.findIndex(x => x.tabNumber === tabNumber);
		if (index > -1 && $event) {
			this.tabResult.splice(index, 1);
		}

		if (!$event) {
			if (index === -1) {
				this.tabResult.push({ tabNumber: tabNumber, result: $event });
			}
			else {
				this.tabResult[index].result = $event;
			}
		}

		if (this.tabResult.length > 0) {
			const ordered = this.tabResult.sort((a, b) => a.tabNumber - b.tabNumber);
			this.tab.setActiveTab(ordered[0].tabNumber);
		}
	}
	// #endregion Actions

	// #region Private Methods
	private getTabTitle = (title: string, iconName: string): SafeHtml => {
		const icon = `<i class="${this.applicationLocalizationService.isRTL ? 'ps-1' : 'pe-1'} ${iconName} "></i>`;
		return this.sanitizer.bypassSecurityTrustHtml(`${icon} ${title}`);
	}
	// #endregion Private Methods
}
