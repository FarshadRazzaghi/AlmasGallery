import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { _ProductBaseComponent } from '../../_product.base.component';

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
export class ProductInventoryComponent extends _ProductBaseComponent {

  @ViewChild('productInventoryTab') tab!: FrTab.FrTabComponent;

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

  private tabResult: { tabNumber: number, result: boolean }[] = [];

  constructor(private sanitizer: DomSanitizer, elementRef: ElementRef) {
    super(elementRef);
  }

  protected getValidate = ($event: boolean, tabnumber: number): void => {
    var index = this.tabResult.findIndex(x => x.tabNumber === tabnumber);
    if (index > -1 && $event) {
      this.tabResult.splice(index, 1);
    }

    if (!$event) {
      if (index === -1) {
        this.tabResult.push({ tabNumber: tabnumber, result: $event });
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

  private getTabTitle = (title: string, iconName: string): SafeHtml => {
    const icon = `<i class="${this.applicationLocalizationService.isRTL ? 'ps-1' : 'pe-1'} ${iconName} "></i>`;
    return this.sanitizer.bypassSecurityTrustHtml(`${icon} ${title}`);
  }
}
