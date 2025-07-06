import { Component, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BaseComponentDirective } from '@core/components';
import { ProductCategoryHttpService, ProductCategoryResponse } from '@core/generated';
import { HeaderActionButton, ProductCategoryResource } from '@core/models';
import { environment } from '@environments/environment';

import { FrCardComponent } from '@fr-widget/sdk/card';
import { FrDataGridColumn, FrDataGridComponent } from '@fr-widget/sdk/data-grid';

@Component({
  standalone: true,
  selector: 'app-pc-list',
  templateUrl: './list.component.html',
  imports: [
    RouterLink,
    FrCardComponent,
    FrDataGridComponent
  ],
})
export class ListComponent extends BaseComponentDirective {

  @ViewChild('productCategoryListDataGrid')
  private dataGrid!: FrDataGridComponent<ProductCategoryResponse>;

  //#region Injected Services
  private readonly productCategoryHttpService = inject(ProductCategoryHttpService);
  //#endregion

  //#region Lifecycle Hooks
  protected override async afterViewInit(): Promise<void> {
    setTimeout(async () => {
      this.documentService.setButtons(this.actionButtons);
      await this.loadProductCategories();
    })
  }
  //#endregion

  //#region Load & Map Data
  private async loadProductCategories(): Promise<void> {
    try {
      const response = await this.productCategoryHttpService.getAllProductCategories(false);
      if (response.status) {
        const groups = response.data ?? [];
        const enrichedCategories = this.mapProductCategoriesToString(groups);
        this.dataGrid.setRecords(enrichedCategories);
      }
    } catch (error) {
      console.error('[ProductCategoryListComponent] Failed to load product categories:', error);
    }
  }

  private mapProductCategoriesToString(
    groups: ProductCategoryResponse[]
  ): ProductCategoryResponse[] {
    return groups.map(group => ({
      ...group,
    }));
  }
  //#endregion

  //#region Accessors
  protected get actionButtons(): HeaderActionButton[] {
    return [
      {
        directive: 'link',
        identifierName: 'AddNewProductCategory',
        color: 'primary',
        text: this.applicationResource.add,
        isVisible: true,
        isEnable: true,
        target: '_self',
        isExternalLink: false,
        routeLink: `/${environment.dashboard}/product-categories/add`,
      },
    ];
  }

  protected get columns(): FrDataGridColumn[] {
    return [
      //{
      //  dataType: 'string',
      //  field: 'name',
      //  header: this.customFieldResource.groupName,
      //  sortable: true,
      //  width: 300,
      //},
      //{
      //  dataType: 'string',
      //  field: 'entityType',
      //  header: this.customFieldResource.groupEntityType,
      //  sortable: true,
      //  width: 200,
      //},
      //{
      //  dataType: 'string',
      //  field: 'stringCustomFields',
      //  header: this.customFieldResource.options,
      //  sortable: true,
      //  width: 950,
      //},
    ];
  }

  protected get productCategoryResource(): ProductCategoryResource {
    return this.applicationLocalizationService.resource.productCategoryResource;
  }
  //#endregion
}
