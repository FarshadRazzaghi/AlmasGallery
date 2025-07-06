import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntil } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { ProductCategoryResource } from '@core/models';
import { FrButtonIconDirective } from '@fr-widget/sdk/button';
import { FrDragDropDirective, FrDragHandleDirective } from '@fr-widget/sdk/drag-drop';

import { BaseFormComponentDirective } from '@shared/components';

import { ProductCategoryCustomFieldGroup, ProductCategoryCustomFieldGroupForm } from '../../../models/product-category.model';
import { CustomFieldGroupSharedService } from '../../../services/custom-field-group-shared.service';

import { FormComponent } from './form/form.component';

@Component({
  standalone: true,
  selector: 'app-pc-upsert-cfg',
  templateUrl: './custom-field-group.component.html',
  imports: [
    FrButtonIconDirective,
    FrDragDropDirective,
    FrDragHandleDirective,
    FormComponent,
    NgIf,
    NgFor
  ],
})
export class CustomFieldGroupComponent extends BaseFormComponentDirective<ProductCategoryCustomFieldGroup | undefined> {

  //#region Injected Services
  private readonly customFieldGroupSharedService = inject(CustomFieldGroupSharedService);
  //#endregion

  //#region State
  private afterViewInitDone!: Promise<void>;
  private afterViewInitResolver!: () => void;

  protected formSubmitted: boolean = false;
  protected customFieldGroups: ProductCategoryCustomFieldGroupForm[] = [];

  private isUpdating: boolean = false;
  //#endregion

  //#region Lifecycle Hooks
  protected override async afterViewInit(): Promise<void> {
    super.afterViewInit();

    this.afterViewInitDone = new Promise<void>((resolve) => {
      this.afterViewInitResolver = resolve;
    });

    this.customFieldGroupSharedService
      .updating$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ state }) => {
        this.isUpdating = state;
      });

    setTimeout(() => {
      this.afterViewInitResolver();
    })
  }

  protected override async onSubmitForm(): Promise<void> {
    if (this.isUpdating) {
      this.formHandlerService.submitResult(this.id, false);
      alert('Updating an CustomField is in Progress...');
      return
    }

    this.customFieldGroups.map((cfg: ProductCategoryCustomFieldGroupForm, index: number) => {
      cfg.order = index + 1;
      cfg.isActive = cfg.isActive ?? false;
    });

    this.formHandlerService.submitResult(this.id, true, { customFieldGroups: this.customFieldGroups });
  }

  protected override async onSetModel(model: ProductCategoryCustomFieldGroup | undefined): Promise<void> {
    if (this.afterViewInitDone) {
      await this.afterViewInitDone;
    }

    this.customFieldGroups = [];
    if (!model) {
      return;
    }

    model.customFieldGroups
      .forEach((pccfg: ProductCategoryCustomFieldGroupForm, index: number) => {
        const customFieldGroup: ProductCategoryCustomFieldGroupForm = {
          uniqueId: uuidv4(),
          order: index,
          isActive: true,
          customFieldGroupName: '',
          customFieldGroupId: pccfg.customFieldGroupId,
          customFieldGroupLocation: pccfg.customFieldGroupLocation,
        };

        this.customFieldGroups.push(customFieldGroup);
      });

    this.customFieldGroups;
  }

  protected override async onResetModel(): Promise<void> { }
  //#endregion

  //#region Template Event Handlers
  protected onAddOrUpdate = async (data: { data: ProductCategoryCustomFieldGroupForm, operation: 'AddNew' | 'Update' }): Promise<void> => {
    this.formSubmitted = false;

    const { data: customFiedlGroup, operation } = data;
    const sameCustomFieldGroupIdExsitedIndex = this.customFieldGroups.findIndex(x => x.customFieldGroupId === customFiedlGroup.customFieldGroupId);
    if (operation == 'AddNew') {
      if (sameCustomFieldGroupIdExsitedIndex >= 0) {
        alert(`There is no option with name (${customFiedlGroup.customFieldGroupName}) ...`);
        return;
      }

      customFiedlGroup.uniqueId = uuidv4();
      this.customFieldGroups.push(customFiedlGroup);
    }
    else {
      if (sameCustomFieldGroupIdExsitedIndex < 0) {
        return;
      }

      this.customFieldGroups[sameCustomFieldGroupIdExsitedIndex] = { ...this.customFieldGroups[sameCustomFieldGroupIdExsitedIndex], ...customFiedlGroup };
    }

    setTimeout(() => {
      this.formSubmitted = true;
    })
  }

  protected onRemove = async (data: ProductCategoryCustomFieldGroupForm): Promise<void> => {
    const optionIndex = this.customFieldGroups.findIndex(x => x.uniqueId === data.uniqueId);
    if (optionIndex < 0) {
      return;
    }

    this.customFieldGroups.splice(optionIndex, 1);
  }

  protected onUpdatedList = async (data: ProductCategoryCustomFieldGroupForm[]): Promise<void> => {
    this.customFieldGroups = data;
  }

  protected onMoveUp = async (index: number): Promise<void> => {
    this.move(index, index - 1);
  }

  protected onMoveDown = async (index: number): Promise<void> => {
    this.move(index, index + 1);
  }

  protected trackByIdentifier = (index: number, item: ProductCategoryCustomFieldGroupForm): string => {
    return item.uniqueId + '-' + (index + 1);
  }
  //#endregion

  //#region Private Methods
  private move(from: number, to: number): void {
    if (to < 0 || to >= this.customFieldGroups.length) return;

    const cloned = [...this.customFieldGroups];
    const item = cloned.splice(from, 1)[0];
    cloned.splice(to, 0, item);

    this.onUpdatedList(cloned);
  }
  //#endregion

  //#region Accessors
  protected get productCategoryResource(): ProductCategoryResource {
    return this.applicationLocalizationService.resource.productCategoryResource;
  }
  //#endregion
}
