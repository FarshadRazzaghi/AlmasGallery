import { Injectable } from '@angular/core';
import { CustomFieldGroupHttpService, CustomFieldGroupLocationType } from '@core/generated';
import { LocalizationService } from '@core/services';
import { FrInputValueItem } from '@fr-widget/sdk/form';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomFieldGroupSharedService {
  private customFieldGroupItemsCache?: FrInputValueItem<number>[];
  private loadingPromise?: Promise<FrInputValueItem<number>[]>;

  private customFieldGroupLocationItemsCache?: FrInputValueItem<CustomFieldGroupLocationType>[];

  private updatingSource = new Subject<{ senderId: string; state: boolean }>();

  constructor(private http: CustomFieldGroupHttpService, private appLocalization: LocalizationService) { }

  public updating$ = this.updatingSource.asObservable();

  public notifyUpdating(senderId: string, state: boolean) {
    this.updatingSource.next({ senderId, state });
  }

  public async refreshCustomFieldGroupItems(): Promise<FrInputValueItem<number>[]> {
    this.customFieldGroupItemsCache = undefined;
    this.loadingPromise = undefined;

    return this.getCustomFieldGroupItems();
  }

  public async getCustomFieldGroupItems(): Promise<FrInputValueItem<number>[]> {
    if (this.customFieldGroupItemsCache) {
      return this.customFieldGroupItemsCache;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.http.getCustomFieldGroupsForDropdown().then(response => {
      if (!response.status || !response.data) {
        throw new Error(response.message ?? 'Failed to load items');
      }

      this.customFieldGroupItemsCache = response.data.map((x, i) => ({
        key: x.value,
        value: x.key,
        order: i + 1,
        selectable: true,
      }));

      return this.customFieldGroupItemsCache;
    });

    return this.loadingPromise;
  }

  public getCustomFieldGroupLocationItems(): FrInputValueItem<CustomFieldGroupLocationType>[] {
    if (this.customFieldGroupLocationItemsCache) {
      return this.customFieldGroupLocationItemsCache;
    }

    const res = this.appLocalization.resource.enumResource.customFieldGroupLocationType;
    this.customFieldGroupLocationItemsCache = [
      { key: res.pageSection, value: 1, order: 1, selectable: true },
      { key: res.pricingSection, value: 2, order: 2, selectable: true },
      { key: res.descriptionSection, value: 3, order: 3, selectable: true }
    ];
    return this.customFieldGroupLocationItemsCache;
  }
}
