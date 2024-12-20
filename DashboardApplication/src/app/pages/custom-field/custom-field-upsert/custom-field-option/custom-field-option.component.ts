import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FrButtonIconDirective } from '@fr-widget/sdk/button';
import { Subscription } from 'rxjs';
import { v7 as uuid } from 'uuid';

import { _CustomFieldUpsertBaseComponent } from '../_custom-field-upsert.base.component';
import { CustomFieldOptionValidation, CustomFieldUpsertOption } from '../../../../types/custom-fields/custom-field-upsert.type';
import { equalOrGreaterValidator } from '../custom-field-validators.component';

import * as FrForm from '@fr-widget/sdk/form';

export type ExtendedCustomFieldUpsertOption =
  CustomFieldUpsertOption & {
    initValueNumber?: number;
    initValueString?: string;
    initValueDateTime?: Date;
    initValueBoolean?: boolean;
    parentConditionNumber?: number;
    parentConditionString?: string;
    parentConditionDateTime?: Date;
    parentConditionBoolean?: boolean;
  }

@Component({
  selector: 'custom-field-option',
  standalone: true,
  imports: [
    FrButtonIconDirective,
    FrForm.FrFormComponent,
    FrForm.FrFormControlComponent,
    FrForm.FrFormGroupComponent,
    FrForm.FrFormControlDirecitveModule,
  ],
  templateUrl: './custom-field-option.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CustomFieldOptionComponent extends _CustomFieldUpsertBaseComponent {

  @ViewChild('customFieldForm') form!: FrForm.FrFormComponent<ExtendedCustomFieldUpsertOption>;

  private get ErrorMessage(): string {
    return this.customFieldResource.minValueCustomErrorMessage;
  }

  //#region FrForm.FrInputValueItem
  protected get numberDataType(): FrForm.FrInputValueItem<number> {
    return {
      key: this.customFieldResource.numberDataType,
      value: 1,
      order: 0,
      selectable: true
    }
  };
  protected get stringDataType(): FrForm.FrInputValueItem<number> {
    return {
      key: this.customFieldResource.stringDataType,
      value: 2,
      order: 1,
      selectable: true
    }
  };
  protected get dateDataType(): FrForm.FrInputValueItem<number> {
    return {
      key: this.customFieldResource.dateDataType,
      value: 3,
      order: 2,
      selectable: true
    }
  };
  protected get booleanDataType(): FrForm.FrInputValueItem<number> {
    return {
      key: this.customFieldResource.booleanDataType,
      value: 4,
      order: 3,
      selectable: true
    }
  };
  //#endregion FrForm.FrInputValueItem

  // #region Fields
  protected isUpdating: boolean = false;
  protected applyCurrentDate: boolean = false;
  protected nowDate: Date = new Date();

  protected dataType: number = this.numberDataType.value ?? 1;

  protected parentDataType: number = 0;
  protected parentId: string | undefined = undefined;

  private subscription: Subscription;
  private resetSubscription: Subscription;
  private selectedItemId: string | undefined;
  // #endregion Fields

  // #region Validators
  protected customFieldNameValidators: FrForm.FrFormControlValidator = {
    required: true
  }

  protected customFieldNumberValidators: FrForm.FrFormControlValidator = {};
  // #endregion Validators

  //#region DropDownItems
  protected get CustomFieldDataTypeItems(): FrForm.FrInputValueItem<number>[] {
    return [
      this.numberDataType,
      this.stringDataType,
      this.dateDataType,
      this.booleanDataType,
    ];
  }

  protected get CustomFieldInitValueBooleanItems(): FrForm.FrInputValueItem<number>[] {
    return [
      {
        key: this.applicationResource.no,
        value: 0,
        order: 0,
        selectable: true
      },
      {
        key: this.applicationResource.yes,
        value: 1,
        order: 1,
        selectable: true
      }
    ];
  }
  //#endregion DropDownItems

  constructor(elementRef: ElementRef) {
    super(elementRef);

    this.subscription = this.customFieldService
      .customFieldUpdatation
      .subscribe(option => {
        if (this.form && option) {
          if (this.selectedItemId === option.uuid) {
            return;
          }

          this.dataType = option.dataType;
          this.isUpdating = true;
          this.selectedItemId = option.uuid;

          const extendedOption: ExtendedCustomFieldUpsertOption = <ExtendedCustomFieldUpsertOption>option;
          this.getDataTypeValidation(extendedOption);
          this.getDataTypeInitValue(option, extendedOption);
          this.getDataTypeParentCondition(option, extendedOption);

          setTimeout(async () => {
            await this.form.setModel(extendedOption);
          })
        }
      })

    this.resetSubscription = this.customFieldService
      .customFieldRecitation
      .subscribe(option => {
        if (this.form && option) {
          setTimeout(async () => {
            await this.onReset();
          })
        }
      })
  }

  protected override onInit(): void { }

  protected override async afterViewInit(): Promise<void> {
    const maxValueController = this.form.getFormControlByPresenter("NumberMaxValue");
    if (maxValueController) {
      this.form.addCustomValidator("numberMinValue", { validator: equalOrGreaterValidator(maxValueController), message: this.ErrorMessage });
    }

    await this.onReset();
  }

  protected override onDestroy(): void {
    this.subscription.unsubscribe();
    this.resetSubscription.unsubscribe();
  }

  protected onRemoveCustomField = async (): Promise<void> => {
    const options: ExtendedCustomFieldUpsertOption[] = this.customField.options || [];
    const index = options.findIndex(x => x.uuid === this.selectedItemId);

    if (index > -1) {
      options.splice(index, 1);
      this.customField.options = options;
      await this.onReset();
    }
  }

  protected onCancelCustomField = async (): Promise<void> => {
    await this.onReset();
  }

  protected onAddNewCustomField = (): void => {
    this.onSubmit();
  }

  protected onCancelUpdateNewCustomField = async (): Promise<void> => {
    await this.onReset();
  }

  protected onDataTypeChange = async (result: FrForm.FrFormControlChangeResult<number, Event>): Promise<void> => {
    this.dataType = result.value ?? 0;
  }

  protected onCurrentDateChange = async (result: FrForm.FrFormControlChangeResult<boolean, Event>): Promise<void> => {
    this.applyCurrentDate = !this.applyCurrentDate;
  }

  protected onParentChange = async (result: FrForm.FrFormControlChangeResult<string | null, Event>): Promise<void> => {
    if (!result.value) {
      this.parentDataType = 0;
      return
    }

    const parent = this.getParent(result.value);
    if (!parent) {
      return;
    }

    this.parentDataType = parent.dataType;
  }

  // #region Private Methods
  private onSubmit = async (): Promise<void> => {
    if (this.form) {
      const options: ExtendedCustomFieldUpsertOption[] = this.customField.options ?? [];

      var model = await this.form.onSubmit();
      //this.applicationDocumentService.addResult(this.form.id, model.isValid);

      if (model.isValid && model.data) {
        var customField: CustomFieldUpsertOption = {
          uuid: (this.isUpdating && this.selectedItemId) ? this.selectedItemId : uuid(),
          dataType: model.data.dataType,
          dataTypeName: this.CustomFieldDataTypeItems.find(x => x.value == model.data?.dataType)?.key.toString() ?? '',
          name: model.data.name,
          isActive: model.data.isActive,
          helpText: model.data.helpText,
          placeHolder: model.data.placeHolder,
          isRequired: model.data.isRequired,
          customFieldParent: model.data.customFieldParent,
        };

        this.convertModelToCustomFieldOption(model, customField);
        this.convertParentModelToParentCustomFieldOption(model, customField);
        this.createValidationForCustomField(customField);

        if (!this.isUpdating) {
          options.push(customField);
        }
        else {
          const exsitedCustomField = options.find(x => x.uuid === this.selectedItemId);
          customField.id = exsitedCustomField?.id;

          if (exsitedCustomField) {
            const index = options.indexOf(exsitedCustomField);
            options[index] = customField;
          }
        }

        this.customField.options = options;
        await this.onReset();
      }
    }
  }

  private onReset = async (): Promise<void> => {
    this.isUpdating = false;
    this.selectedItemId = undefined;

    this.dataType = this.numberDataType.value ?? 1;
    this.applyCurrentDate = false;

    this.parentDataType = 0;
    this.parentId = undefined;

    setTimeout(async () => {
      var parentCustomField = this.form.formControls['customFieldParent'];
      Object.defineProperties(parentCustomField, {
        items: {
          get: () => { return this.getParentCustomFieldItems(); }
        }
      });

      var customFieldDataType = this.form.formControls['dataType'];
      Object.defineProperties(customFieldDataType, {
        items: {
          get: () => { return this.CustomFieldDataTypeItems; }
        }
      });

      var initValueBoolean = this.form.formControls['initValueBoolean'];
      Object.defineProperties(initValueBoolean, {
        items: {
          get: () => { return this.CustomFieldInitValueBooleanItems; }
        }
      });

      var parentConditionBoolean = this.form.formControls['parentConditionBoolean'];
      Object.defineProperties(parentConditionBoolean, {
        items: {
          get: () => { return this.CustomFieldInitValueBooleanItems; }
        }
      });
    })

    await this.form.onReset();
  }

  private getParent = (parentId: string | undefined | null): ExtendedCustomFieldUpsertOption | undefined => {
    return (this.customField.options ?? []).find(x => x.uuid == parentId);
  }

  private getParentCustomFieldItems = (): FrForm.FrInputValueItem<string | null>[] => {
    const options: ExtendedCustomFieldUpsertOption[] = (this.customField.options ?? []);

    return options
      .filter((x: ExtendedCustomFieldUpsertOption) => !this.isUpdating || (this.isUpdating && x.uuid !== this.selectedItemId && x.customFieldParent !== this.selectedItemId))
      .map((x: ExtendedCustomFieldUpsertOption, index: number) => {
        return {
          key: x.name,
          value: x.uuid,
          order: index,
          selectable: x.isActive,
        } as FrForm.FrInputValueItem<string>
      });
  }

  private getDataTypeInitValue = (customField: CustomFieldUpsertOption, extendedCustomField: ExtendedCustomFieldUpsertOption): void => {
    extendedCustomField.initValueNumber = 0;
    extendedCustomField.initValueString = '';
    extendedCustomField.initValueDateTime = this.nowDate;
    extendedCustomField.initValueBoolean = false;

    switch (customField.dataType) {
      case this.numberDataType.value:
        {
          extendedCustomField.initValueNumber = +(<number>customField.initialValue);
          break;
        }

      case this.stringDataType.value:
        {
          extendedCustomField.initValueString = <string>customField.initialValue;
          break;
        }

      case this.dateDataType.value:
        {
          this.applyCurrentDate = extendedCustomField.applyCurrentDate ?? false;
          extendedCustomField.initValueDateTime = extendedCustomField.applyCurrentDate ? this.nowDate : <Date>customField.initialValue;
          break;
        }

      case this.booleanDataType.value:
        {
          extendedCustomField.initValueBoolean = <boolean>customField.initialValue;
          break;
        }
    }
  }

  private getDataTypeParentCondition = (customField: CustomFieldUpsertOption, extendedCustomField: ExtendedCustomFieldUpsertOption): void => {
    this.parentDataType = 0;

    extendedCustomField.parentConditionNumber = 0;
    extendedCustomField.parentConditionString = '';
    extendedCustomField.parentConditionDateTime = this.nowDate;
    extendedCustomField.parentConditionBoolean = false;

    const parent = this.getParent(customField.customFieldParent);
    if (!parent) {
      return;
    }

    this.parentDataType = parent.dataType;
    debugger;

    switch (parent.dataType) {
      case this.numberDataType.value:
        {
          let number = <number>customField.parentCondition;
          if (isNaN(number)) {
            number = 0;
          }

          extendedCustomField.parentConditionNumber = number;
          break;
        }

      case this.stringDataType.value:
        {
          extendedCustomField.parentConditionString = <string>customField.parentCondition;
          break;
        }

      case this.dateDataType.value:
        {
          let tryParse = Date.parse(<string>customField.parentCondition);
          let date = this.nowDate;

          if (!isNaN(tryParse)) {
            date = new Date(tryParse);
          }

          extendedCustomField.parentConditionDateTime = date;
          break;
        }

      case this.booleanDataType.value:
        {
          extendedCustomField.parentConditionBoolean = <boolean>customField.parentCondition;
          break;
        }
    }
  }

  private getDataTypeValidation = (extendedCustomField: ExtendedCustomFieldUpsertOption): void => {
    var validation: CustomFieldOptionValidation = JSON.parse(extendedCustomField.validation || '');

    extendedCustomField.numberMinValue = 0;
    extendedCustomField.numberMaxValue = 9999;
    extendedCustomField.isMultiLine = false;
    extendedCustomField.regex = '';

    switch (extendedCustomField.dataType) {
      case this.numberDataType.value:
        {
          extendedCustomField.numberMinValue = validation.numberMinValue ?? 0;
          extendedCustomField.numberMaxValue = validation.numberMaxValue ?? 9999;
          break;
        }

      case this.stringDataType.value:
        {
          extendedCustomField.isMultiLine = validation.isMultiLine;
          extendedCustomField.regex = validation.regex;
          break;
        }

      case this.dateDataType.value:
        {
          this.applyCurrentDate = validation.applyCurrentDate ?? false;
          extendedCustomField.applyCurrentDate = validation.applyCurrentDate;
          break;
        }

      case this.booleanDataType.value: { break; }
    }
  }

  private convertModelToCustomFieldOption = (model: FrForm.FrFormSubmitResult<ExtendedCustomFieldUpsertOption>, customField: CustomFieldUpsertOption): void => {
    if (!model.data) {
      return;
    }

    switch (model.data.dataType) {
      case this.numberDataType.value:
        {
          customField.numberMinValue = model.data.numberMinValue;
          customField.numberMaxValue = model.data.numberMaxValue;
          customField.initialValue = model.data.initValueNumber;
          break;
        }

      case this.stringDataType.value:
        {
          customField.regex = model.data.regex;
          customField.isMultiLine = model.data.isMultiLine;
          customField.initialValue = model.data.initValueString;
          break;
        }

      case this.dateDataType.value:
        {
          customField.applyCurrentDate = model.data.applyCurrentDate;
          customField.initialValue = model.data.initValueDateTime;
          break;
        }

      case this.booleanDataType.value:
        {
          customField.initialValue = model.data.initValueBoolean;
          break;
        }
    }
  }

  private convertParentModelToParentCustomFieldOption = (model: FrForm.FrFormSubmitResult<ExtendedCustomFieldUpsertOption>, customField: CustomFieldUpsertOption): void => {
    if (!model.data) {
      return;
    }

    const parent = this.getParent(model.data.customFieldParent);
    if (!parent) {
      return;
    }

    switch (parent.dataType) {
      case this.numberDataType.value:
        {
          customField.parentCondition = model.data.parentConditionNumber?.toString();
          break;
        }

      case this.stringDataType.value:
        {
          customField.parentCondition = model.data.parentConditionString?.toString();
          break;
        }

      case this.dateDataType.value:
        {
          customField.parentCondition = model.data.parentConditionDateTime?.toString();
          break;
        }

      case this.booleanDataType.value:
        {
          customField.parentCondition = model.data.parentConditionBoolean?.toString();
          break;
        }
    }
  }

  private createValidationForCustomField = (customField: ExtendedCustomFieldUpsertOption): void => {
    const validation: CustomFieldOptionValidation = {
      isMultiLine: customField.isMultiLine,
      applyCurrentDate: customField.applyCurrentDate,
      numberMaxValue: customField.numberMaxValue,
      numberMinValue: customField.numberMinValue,
      regex: customField.regex,
    };

    customField.validation = JSON.stringify(validation);

    delete customField.isMultiLine;
    delete customField.applyCurrentDate;
    delete customField.numberMaxValue;
    delete customField.numberMinValue;
    delete customField.regex;
  }
  // #endregion Private Methods
}
