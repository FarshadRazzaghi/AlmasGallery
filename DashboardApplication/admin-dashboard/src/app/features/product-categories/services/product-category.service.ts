import { Injectable } from '@angular/core';
import { FrInputValueItem } from '@fr-widget/sdk/form';
import { ProductCategoryHttpService } from '../../../core/generated';

@Injectable({ providedIn: 'root' })
export class ProductCategoryService {
  private productCategoryItemsCache?: FrInputValueItem<number>[];
  private loadingPromise?: Promise<FrInputValueItem<number>[]>;

  constructor(private http: ProductCategoryHttpService) { }

  public async refreshProductCategoryItems(): Promise<FrInputValueItem<number>[]> {
    this.productCategoryItemsCache = undefined;
    this.loadingPromise = undefined;

    return this.getProductCategoryItems();
  }

  public async getProductCategoryItems(parentId?: number): Promise<FrInputValueItem<number>[]> {
    if (this.productCategoryItemsCache) {
      return this.productCategoryItemsCache;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.http.getProductCategoriesForDropdown(parentId, true).then(response => {
      if (!response.status || !response.data) {
        throw new Error(response.message ?? 'Failed to load items');
      }

      this.productCategoryItemsCache = response.data.map((x, i) => ({
        key: x.value,
        value: x.key,
        order: i + 1,
        selectable: true,
      }));

      return this.productCategoryItemsCache;
    });

    return this.loadingPromise;
  }
}
