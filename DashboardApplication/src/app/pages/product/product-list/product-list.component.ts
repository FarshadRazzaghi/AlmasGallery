import { Component, ElementRef, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { _ProductBaseComponent } from '../_product.base.component';
import { ProductHttpService } from '../../../services/http/products/product-http.service';
import { ProductUpsert, convertToModel } from '../../../types/products/product-upsert.type';

import * as FrCard from '@fr-widget/sdk/card';
import * as FrDataGrid from '@fr-widget/sdk/data-grid';
import { HeaderActionButton } from '../../../types/button.interface';

@Component({
  selector: 'product-list',
  standalone: true,
  imports: [
    RouterLink,
    FrCard.FrCardComponent,
    FrCard.FrCardHeaderComponent,
    FrCard.FrCardFooterComponent,

    FrDataGrid.FrDataGridComponent,
  ],
  templateUrl: './product-list.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent extends _ProductBaseComponent {

  @ViewChild('productListDataGrid') dataGrid!: FrDataGrid.FrDataGridComponent<ProductUpsert>;

  protected productHttpService: ProductHttpService = inject(ProductHttpService);

  protected get actionButtons(): HeaderActionButton[] {
    const actionButtons: HeaderActionButton[] = [
      {
        directive: 'link',
        color: 'primary',
        identifierName: 'AddNewProduct',
        text: '',
        isVisible: true,
        isEnable: true,
        target: '_self',
        isExternalLink: false,
        routeLink: '/products/add'
      }
    ];

    Object.defineProperties(actionButtons.find(x => x.identifierName === 'AddNewProduct'), {
      text: {
        get: () => { return this.applicationLocalizationService.resource.routingResource.productsAdd; }
      }
    });

    return actionButtons;
  }

  protected get columns(): FrDataGrid.FrDataGridColumn[] {
    return [
      {
        field: 'image',
        dataType: 'string',
        header: this.productResource.productImage,
        visible: false,
        sortable: false,
        width: 10
      },
      {
        field: 'name',
        dataType: 'string',
        header: this.productResource.name,
        sortable: true,
        width: 10
      },
      {
        field: 'categoryId',
        dataType: 'string',
        header: this.productResource.category,
      },
      {
        field: 'vendorId',
        dataType: 'string',
        header: this.productResource.vendor,
      },
      {
        field: 'basePrice',
        dataType: 'string',
        header: this.productResource.basePrice,
      },
      {
        field: 'quantity',
        dataType: 'number',
        header: this.productResource.quantity,
      }
    ];
  }

  private isWaiting: boolean = false;

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  protected override onInit(): void {
    this.applicationDocumentService.setButtons(this.actionButtons);
  }

  protected override async afterViewInit(): Promise<void> {
    //this.isWaiting = true;
    var list = await this.productHttpService.getList();

    if (list) {
      var model = list.map(a => convertToModel(a));

      setTimeout(() => {
        this.dataGrid.setRecords(model);
      })
    }

    //setTimeout(() => {
    //  this.isWaiting = false;
    //}, 3000)
  }

  protected override onDestroy(): void { }
}
