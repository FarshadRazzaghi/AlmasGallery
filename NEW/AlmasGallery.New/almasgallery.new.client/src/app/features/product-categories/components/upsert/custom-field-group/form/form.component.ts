import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { NavigationRoute } from '@core/config';
import { CustomFieldGroupLocationType } from '@core/generated';
import { ProductCategoryResource } from '@core/models';

import {
  FrFormComponent,
  FrFormControlComponent,
  FrFormControlDirectiveModule,
  FrFormControlValidator,
  FrFormGroupComponent,
  FrInputValueItem
} from '@fr-widget/sdk/form';

import { BaseComponentDirective } from '@core/components';
import { FrWidgetError } from '@fr-widget/sdk';

import { CustomFieldGroupLocationTypeEnum, ProductCategoryCustomFieldGroupForm } from '../../../../models/product-category.model';
import { CustomFieldGroupSharedService } from '../../../../services/custom-field-group-shared.service';

@Component({
  standalone: true,
  selector: 'app-pc-upsert-cfg-form',
  templateUrl: './form.component.html',
  imports: [
    FrFormComponent,
    FrFormControlComponent,
    FrFormGroupComponent,
    FrFormControlDirectiveModule,
  ]
})
export class FormComponent extends BaseComponentDirective {

  @ViewChild('customFieldGroupForm', { static: false })
  form!: FrFormComponent<ProductCategoryCustomFieldGroupForm>;

  @Input() set submitted(val: boolean) {
    if (val) {
      setTimeout(async () => {
        await this.onResetModel();
      })
    }
  }
  @Input() customFieldGroup: ProductCategoryCustomFieldGroupForm | undefined = undefined;

  @Output() submitForm = new EventEmitter<{ data: ProductCategoryCustomFieldGroupForm, operation: 'AddNew' | 'Update' }>();
  @Output() removeCustomFieldGroup = new EventEmitter<ProductCategoryCustomFieldGroupForm>();

  //#region Injected Services
  private readonly customFieldGroupSharedService = inject(CustomFieldGroupSharedService);
  //#endregion

  //#region State
  private afterViewInitDone!: Promise<void>;
  private afterViewInitResolver!: () => void;

  protected operation: 'AddNew' | 'Update' = 'AddNew';

  protected isUpdating: boolean = false;

  protected customFieldGroupLoading: boolean = false;

  protected customFieldGroupItems: FrInputValueItem<number>[] = [];
  protected customFieldGroupLocationItems: FrInputValueItem<CustomFieldGroupLocationType>[] = [];

  protected addNewCustomFieldGroupLink: string = `/${NavigationRoute['dashboard']}/${NavigationRoute['customFieldGroups']}/add`;

  private otherIsUpdating: boolean = false;
  private componentId: string = uuidv4();
  //#endregion

  //#region Lifecycle Hooks
  protected override async onInit(): Promise<void> {
    this.customFieldGroupSharedService
      .updating$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ senderId, state }) => {
        this.otherIsUpdating = senderId === this.componentId ? false : state;
      });
  }

  protected override async afterViewInit(): Promise<void> {
    this.customFieldGroupLoading = true;

    this.afterViewInitDone = new Promise<void>((resolve) => {
      this.afterViewInitResolver = resolve;
    });

    if (this.customFieldGroup) {
      this.operation = 'Update';
      this.onSetModel({ customFieldGroup: this.customFieldGroup });
    }

    setTimeout(async () => {
      this.customFieldGroupItems = await this.customFieldGroupSharedService.getCustomFieldGroupItems();
      this.customFieldGroupLocationItems = this.customFieldGroupSharedService.getCustomFieldGroupLocationItems();

      this.customFieldGroupLoading = false;
      this.afterViewInitResolver();
    })
  }

  protected async onSubmitForm(): Promise<void> { }

  protected async onSetModel(model: { customFieldGroup: ProductCategoryCustomFieldGroupForm; }): Promise<void> {
    await this.form.setModel(model.customFieldGroup);
  }

  protected async onResetModel(): Promise<void> {
    if (this.operation === 'AddNew') {
      this.form.setModel({
        order: 1,
        customFieldGroupId: this.customFieldGroupItems[0] ? (this.customFieldGroupItems[0].value ?? 0) : 0,
        customFieldGroupLocation: 1,
        isActive: true,
        customFieldGroupName: '',
        uniqueId: ''
      });
      return
    }

    if (this.customFieldGroup) {
      this.isUpdating = false;
      this.form.setModel(this.customFieldGroup);
      this.customFieldGroupSharedService.notifyUpdating(this.componentId, false);
    }
  }
  //#endregion

  //#region Template Event Handlers
  protected getClass = (): string[] => {
    return this.customFieldGroup ? ['col-12'] : ['ms-2', 'col'];
  }

  protected onAddOrUpdate = async (): Promise<void> => {
    if (this.otherIsUpdating) {
      alert('Another Custom Field Group is updating');
      return;
    }

    const formSubmit = await this.form.onSubmit();
    const { isValid, data } = formSubmit;

    if (!isValid || !data) {
      return;
    }

    if (this.customFieldGroup) {
      data.customFieldGroupId = this.customFieldGroup.customFieldGroupId;
    }

    const customFieldGroupItem = this.customFieldGroupItems.find(x => x.value == data.customFieldGroupId);
    if (!customFieldGroupItem) {
      throw new FrWidgetError(`CustomFieldGroup with id ${data.customFieldGroupId} not Found`);
    }

    data.customFieldGroupName = customFieldGroupItem.key.toString();
    this.submitForm.emit({ data: data, operation: this.operation });
  }

  protected onRemove = async (): Promise<void> => {
    if (this.otherIsUpdating) {
      alert('Another Custom Field Group is updating');
      return;
    }

    this.removeCustomFieldGroup.emit(this.customFieldGroup);
  }

  protected onSelectForUpdate = async (): Promise<void> => {
    if (this.otherIsUpdating) {
      alert('Another Custom Field Group is updating');
      return;
    }

    this.isUpdating = true;
    this.customFieldGroupSharedService.notifyUpdating(this.componentId, true);
  }

  protected onCancelUpdate = async (): Promise<void> => {
    await this.onResetModel();
  }

  protected onCustomFieldGroupRefresh = async (): Promise<void> => {
    this.customFieldGroupLoading = true;
    await this.customFieldGroupSharedService.refreshCustomFieldGroupItems();

    setTimeout(async () => {
      this.customFieldGroupItems = await this.customFieldGroupSharedService.getCustomFieldGroupItems();

      this.customFieldGroupLoading = false;
    })
  }
  //#endregion

  //#region Accessors
  protected get isRequired(): FrFormControlValidator {
    return {
      required: true
    }
  }

  protected get customFieldGroupLocationType(): typeof CustomFieldGroupLocationTypeEnum {
    return CustomFieldGroupLocationTypeEnum;
  }

  protected get productCategoryResource(): ProductCategoryResource {
    return this.applicationLocalizationService.resource.productCategoryResource;
  }
  //#endregion
}
