import { NgFor, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import { CustomFieldDataType } from '@core/generated';
import { CustomFieldGroupResource, CustomFieldResource } from '@core/models';
import { ItemNamePipe } from '@core/pipes';
import {
  BetweenControllerValidator,
  BetweenValueValidator,
  BqualOrGreaterControllerValidator,
  MatchRegexControllerValidator,
  MatchRegexValueValidator,
  RegexValidator
} from '@core/validators';
import { BaseFormComponentDirective } from '@shared/components';

import { FrButtonDirective } from '@fr-widget/sdk/button';
import {
  FrFormComponent,
  FrFormControlChangeResult,
  FrFormControlComponent,
  FrFormControlDirectiveModule,
  FrFormControlValidator,
  FrFormGroupComponent,
  FrInputValueItem,
} from '@fr-widget/sdk/form';

import {
  CustomFieldDataTypeEnum,
  CustomFieldGroupCustomField,
  CustomFieldGroupCustomFieldForm,
  CustomFieldGroupCustomFieldParentCondition,
  CustomFieldGroupCustomFieldValidation,
  ExtendedCustomFieldGroupCustomFieldForm
} from '../../../models/custom-field-group.model';

@Component({
  standalone: true,
  selector: 'app-cfg-upsert-cf',
  templateUrl: './custom-field.component.html',
  imports: [
    FrButtonDirective,
    FrFormComponent,
    FrFormControlComponent,
    FrFormGroupComponent,
    FrFormControlDirectiveModule,
    ItemNamePipe,
    NgIf,
    NgFor
  ],
})
export class CustomFieldComponent extends BaseFormComponentDirective<CustomFieldGroupCustomField | undefined> {

  @ViewChild('customFieldForm', { static: false })
  form!: FrFormComponent<ExtendedCustomFieldGroupCustomFieldForm>;

  //#region State
  private afterViewInitDone!: Promise<void>;
  private afterViewInitResolver!: () => void;

  protected readonly nowDate: Date = new Date();
  protected readonly numberValueDefaultRange: number[] = [0, 9999];
  protected readonly hasNoConditionValue: number = 1;

  protected operation: 'AddNew' | 'Update' = 'AddNew';
  protected applyCurrentDate: boolean = false;

  protected selectedDataType: CustomFieldDataType = CustomFieldDataTypeEnum.Number;
  protected selectedUniqueId: string | undefined;

  protected selectedParentCondition: number = this.hasNoConditionValue;
  protected selectedParentDataType: CustomFieldDataType | undefined;
  protected selectedParentUniqueId: string | undefined;

  protected dataTypeItems: FrInputValueItem<CustomFieldDataType>[] = [];
  protected booleanItems: FrInputValueItem<number>[] = [];

  protected parentItems: FrInputValueItem<string>[] = [];
  protected parentConditionItems: FrInputValueItem<number>[] = [];
  protected parentValueValidators: FrFormControlValidator = {};

  protected customFields: ExtendedCustomFieldGroupCustomFieldForm[] = [];
  //#endregion

  //#region Validation
  protected initialValueNumberValidators: FrFormControlValidator = {
    custom: [{
      validator: BetweenControllerValidator('numberMinValue', 'numberMaxValue'),
      message: this.applicationResource.validationResource.betweenErrorMessage,
    }]
  }
  protected initialValueStringValidators: FrFormControlValidator = {
    custom: [{
      validator: MatchRegexControllerValidator('regex'),
      message: this.applicationResource.validationResource.matchRegexErrorMessage,
    }]
  }
  protected numberMinValueValidators: FrFormControlValidator = {
    custom: [{
      validator: BqualOrGreaterControllerValidator('numberMaxValue'),
      message: this.applicationResource.validationResource.equalOrGreaterErrorMessage,
    }]
  }
  protected regexValidators: FrFormControlValidator = {
    custom: [{
      validator: RegexValidator(),
      message: this.applicationResource.validationResource.regexErrorMessage,
    }]
  }
  //#endregion

  //#region Lifecycle Hooks
  protected override async afterViewInit(): Promise<void> {
    super.afterViewInit();

    this.afterViewInitDone = new Promise<void>((resolve) => {
      this.afterViewInitResolver = resolve;
    });

    setTimeout(() => {
      this.dataTypeItems = this.loadDataTypeItems();
      this.booleanItems = this.loadBooleanItems();

      this.afterViewInitResolver();
    })
  }

  protected override async onSubmitForm(): Promise<void> {
    if (this.operation === 'Update') {
      this.formHandlerService.submitResult(this.id, false);
      alert('Updating a Custom Field is in Progress...');
      return
    }

    this.customFields.map((cf: ExtendedCustomFieldGroupCustomFieldForm, index: number) => {
      cf.initialValue = this.getInitialValue(cf);
      cf.validation = this.getValidation(cf);
      cf.parentCondition = this.getParentCondition(cf);
    })

    this.formHandlerService.submitResult(this.id, true, { customFields: this.customFields });
  }

  protected override async onSetModel(model: CustomFieldGroupCustomField | undefined): Promise<void> {
    debugger;
    if (this.afterViewInitDone) {
      await this.afterViewInitDone;
    }

    this.customFields = [];
    if (!model) {
      return;
    }

    const mapParent = new Map<number, { parentId: number; condition: string }>();
    model.customFields.forEach((cf: ExtendedCustomFieldGroupCustomFieldForm) => {
      const customField: ExtendedCustomFieldGroupCustomFieldForm = {
        id: cf.id,
        uniqueId: uuidv4(),
        dataType: cf.dataType,
        isActive: cf.isActive,
        isRequired: cf.isRequired,
        name: cf.name,
        helpText: cf.helpText,
        placeHolder: cf.placeHolder,
      };

      if (cf.parentId) {
        mapParent.set(cf.id, { parentId: cf.parentId, condition: cf.parentCondition || '' });
      }

      this.setInitialValue(customField, cf);
      this.setValidation(customField, cf);

      this.customFields.push(customField);
    });

    this.customFields
      .forEach((cf: ExtendedCustomFieldGroupCustomFieldForm) => {
        this.setParentId(cf, mapParent);
        this.setParentCondition(cf, mapParent);
      })

    setTimeout(() => {
      this.parentItems = this.loadParentItems();
    })
  }

  protected override async onResetModel(): Promise<void> {
    this.operation = 'AddNew';

    this.applyCurrentDate = false;

    this.selectedDataType = CustomFieldDataTypeEnum.Number;

    this.selectedUniqueId = undefined;
    this.selectedParentDataType = undefined;
    this.selectedParentUniqueId = undefined;
    this.selectedParentCondition = this.hasNoConditionValue;

    this.parentValueValidators = {};

    this.parentConditionItems = [];
    this.parentItems = this.loadParentItems();

    await this.form.onReset();
  }
  //#endregion

  //#region Private Methods
  private loadDataTypeItems(): FrInputValueItem<CustomFieldDataType>[] {
    const customFieldDataTypeResource = this.applicationLocalizationService.resource.enumResource.customFieldDataType;
    return [
      {
        key: customFieldDataTypeResource.number,
        value: 1,
        order: 1,
        selectable: true,
      },
      {
        key: customFieldDataTypeResource.string,
        value: 2,
        order: 2,
        selectable: true
      },
      {
        key: customFieldDataTypeResource.date,
        value: 3,
        order: 3,
        selectable: true
      },
      {
        key: customFieldDataTypeResource.boolean,
        value: 4,
        order: 3,
        selectable: true
      }
    ];
  }

  private loadBooleanItems(): FrInputValueItem<number>[] {
    return [
      {
        key: this.applicationResource.yes,
        value: 1,
        order: 1,
        selectable: true,
      },
      {
        key: this.applicationResource.no,
        value: 2,
        order: 2,
        selectable: true
      }
    ];
  }

  private loadParentItems(): FrInputValueItem<string>[] {
    return this.customFields
      .filter((cf: ExtendedCustomFieldGroupCustomFieldForm) => {
        return !this.selectedUniqueId || (cf.uniqueId !== this.selectedUniqueId && cf.parentUniqueId !== this.selectedUniqueId);
      })
      .map((cf: ExtendedCustomFieldGroupCustomFieldForm, index: number) => {
        return {
          key: cf.name,
          value: cf.uniqueId,
          order: index,
          selectable: cf.isActive,
        } as FrInputValueItem<string>
      });
  }

  private loadParentConditionItems(dataType: CustomFieldDataType): FrInputValueItem<number>[] {
    const items: FrInputValueItem<number>[] = [
      {
        key: this.conditionResource.noCondition,
        value: this.hasNoConditionValue,
        order: 0,
        selectable: true,
      },
    ];

    const conditionMap: Record<CustomFieldDataType, string[]> = {
      [1]: [
        this.conditionResource.lowerThan,
        this.conditionResource.lowerThanEquals,
        this.conditionResource.higherThan,
        this.conditionResource.higherThanEquals,
      ],
      [2]: [this.conditionResource.contains, this.conditionResource.notContains],
      [3]: [
        this.conditionResource.lowerThan,
        this.conditionResource.lowerThanEquals,
        this.conditionResource.higherThan,
        this.conditionResource.higherThanEquals,
      ],
      [4]: []
    };

    const keys = [this.conditionResource.equals, this.conditionResource.notEquals, ...(conditionMap[dataType] || [])];

    return items.concat(
      keys.map((key, index) => ({
        key,
        value: index + 2,
        order: index + 1,
        selectable: true,
      }))
    );
  }

  //#region InitialValue
  private getInitialValue(item: ExtendedCustomFieldGroupCustomFieldForm): string | undefined {
    const initialValues = new Map<number, unknown>([
      [CustomFieldDataTypeEnum.Number, item.initialValueNumber],
      [CustomFieldDataTypeEnum.String, item.initialValueString],
      [CustomFieldDataTypeEnum.Date, item.applyCurrentDate ? undefined : item.initialValueDate],
      [CustomFieldDataTypeEnum.Boolean, item.initialValueBoolean],
    ]);

    if (!initialValues.has(item.dataType)) {
      throw new Error('Not Supported dataType!');
    }

    return initialValues.get(item.dataType)?.toString();
  }

  private setInitialValue(item: ExtendedCustomFieldGroupCustomFieldForm, customField: ExtendedCustomFieldGroupCustomFieldForm): void {
    const handlers: Record<number, () => void> = {
      [CustomFieldDataTypeEnum.Number]: () => {
        item.initialValueNumber = +(customField.initialValue ?? '0');
      },
      [CustomFieldDataTypeEnum.String]: () => {
        item.initialValueString = customField.initialValue;
      },
      [CustomFieldDataTypeEnum.Date]: () => {
        item.initialValueDate = (customField.applyCurrentDate || !customField.initialValue) ? this.nowDate : new Date(customField.initialValue);
      },
      [CustomFieldDataTypeEnum.Boolean]: () => {
        item.initialValueBoolean = +(customField.initialValue ?? '1');
      }
    };

    if (!handlers[customField.dataType]) {
      throw new Error('Not Supported dataType!');
    }

    handlers[customField.dataType]();
  }
  //#endregion

  //#region Validation
  private getValidation(item: ExtendedCustomFieldGroupCustomFieldForm): string | undefined {
    if (!Object.values(CustomFieldDataTypeEnum).includes(item.dataType)) {
      throw new Error('Not Supported dataType!');
    }

    const validation = new Map<number, Partial<CustomFieldGroupCustomFieldValidation>>([
      [CustomFieldDataTypeEnum.Number, {
        numberMinValue: item.numberMinValue,
        numberMaxValue: item.numberMaxValue,
      }],
      [CustomFieldDataTypeEnum.String, {
        isMultiLine: item.isMultiLine,
        regex: (item.regex ?? '').replace(/\\\\/g, '\\'),
      }],
      [CustomFieldDataTypeEnum.Date, {
        applyCurrentDate: item.applyCurrentDate,
      }]
    ]);

    return validation.has(item.dataType) ? JSON.stringify(validation.get(item.dataType)) : undefined;
  }

  private setValidation(item: ExtendedCustomFieldGroupCustomFieldForm, customField: ExtendedCustomFieldGroupCustomFieldForm): void {
    if (!customField.validation) {
      return;
    }

    const validation: CustomFieldGroupCustomFieldValidation = JSON.parse(customField.validation);

    const dataTypeHandlers: Record<number, () => void> = {
      1: () => {
        item.numberMinValue = validation.numberMinValue;
        item.numberMaxValue = validation.numberMaxValue;
      },
      2: () => {
        item.isMultiLine = validation.isMultiLine ?? false;
        item.regex = (validation.regex ?? '').replace(/\\\\/g, '\\');
      },
      3: () => {
        item.applyCurrentDate = validation.applyCurrentDate ?? false;
      },
      4: () => {
        // No specific validation for Boolean
      },
    };

    if (!dataTypeHandlers[customField.dataType]) {
      throw new Error('Not Supported dataType!');
    }

    dataTypeHandlers[customField.dataType]();
  }
  //#endregion

  //#region ParentId
  private setParentId(item: ExtendedCustomFieldGroupCustomFieldForm, mapParent: Map<number, { parentId: number; condition: string }>): void {
    const parent = mapParent.get(item.id);
    if (!parent) {
      return;
    }

    const parentCustomField = this.customFields.find((cf: CustomFieldGroupCustomFieldForm) => cf.id === parent.parentId);
    if (!parentCustomField) {
      return;
    }

    item.parentUniqueId = parentCustomField.uniqueId;
  }
  //#endregion

  //#region ParentCondition
  private getParentCondition(item: ExtendedCustomFieldGroupCustomFieldForm): string | undefined {
    if (!item.parentConditionOperand || !item.parentUniqueId) {
      return '';
    }

    const parent = this.customFields.find((cf: CustomFieldGroupCustomFieldForm) => cf.uniqueId === item.parentUniqueId);
    if (!parent) {
      return '';
    }

    const parentValueMap = {
      1: item.parentValueNumber,
      2: item.parentValueString,
      3: item.parentValueDate,
      4: item.parentValueBoolean,
    };

    const parentCondition: CustomFieldGroupCustomFieldParentCondition = {
      value: parentValueMap[parent.dataType]?.toString(),
      condition: item.parentConditionOperand,
    };

    return JSON.stringify(parentCondition);
  }

  private setParentCondition(item: ExtendedCustomFieldGroupCustomFieldForm, mapParent: Map<number, { parentId: number; condition: string }>): void {
    const parent = mapParent.get(item.id);
    if (!parent) return;

    const parentCustomField = this.customFields.find((cf: CustomFieldGroupCustomFieldForm) => cf.id === parent.parentId);
    if (!parentCustomField) return;

    const parentCondition: CustomFieldGroupCustomFieldParentCondition = JSON.parse(parent.condition);
    item.parentConditionOperand = parentCondition.condition || this.hasNoConditionValue;

    const dataTypeHandlers = new Map<number, (value?: string) => void>([
      [CustomFieldDataTypeEnum.Number, (value) => item.parentValueNumber = +(value ?? '0')],
      [CustomFieldDataTypeEnum.String, (value) => item.parentValueString = value],
      [CustomFieldDataTypeEnum.Date, (value) => item.parentValueDate = new Date(value ?? this.nowDate)],
      [CustomFieldDataTypeEnum.Boolean, (value) => item.parentValueBoolean = +(value ?? '1')],
    ]);

    dataTypeHandlers.get(parentCustomField.dataType)?.(parentCondition.value);
  }
  //#endregion

  private setParentValueValidation = (): void => {
    const parent = this.customFields.find((cf: CustomFieldGroupCustomFieldForm) => cf.uniqueId == this.selectedParentUniqueId);
    if (!parent) {
      this.selectedParentDataType = undefined;
      return;
    }

    this.parentValueValidators = { required: true };

    switch (parent.dataType) {
      case CustomFieldDataTypeEnum.Number: {
        const min = parent.numberMinValue ?? this.numberValueDefaultRange[0];
        const max = parent.numberMaxValue ?? this.numberValueDefaultRange[1];
        this.parentValueValidators = {
          required: true,
          custom: [{
            validator: BetweenValueValidator(min, max),
            message: this.applicationResource.validationResource.betweenErrorMessageWithParameters.format([`${min}`, `${max}`]),
          }]
        };
        break;
      }
      case CustomFieldDataTypeEnum.String: {
        if (parent.regex) {
          this.parentValueValidators = {
            required: true,
            custom: [{
              validator: MatchRegexValueValidator(parent.regex),
              message: this.applicationResource.validationResource.matchRegexErrorMessageWithParameters.format([parent.regex]),
            }]
          };
        }
        break;
      }
      default:
        break;
    }
  }
  //#endregion

  //#region Template Event Handlers
  protected onDataTypeChange = (item: FrFormControlChangeResult<number, Event>): void => {
    this.selectedDataType = item.value as CustomFieldDataType;
  }

  protected onParentChange = (item: FrFormControlChangeResult<string, Event>): void => {
    this.selectedParentUniqueId = item.value ?? undefined;

    if (!item.value) {
      this.selectedParentDataType = undefined;
      return;
    }

    const parent = this.customFields.find((cf: CustomFieldGroupCustomFieldForm) => cf.uniqueId == item.value);
    if (!parent) {
      this.selectedParentDataType = undefined;
      return;
    }

    this.selectedParentDataType = parent.dataType;
    this.selectedParentCondition = this.hasNoConditionValue;
    this.parentConditionItems = this.loadParentConditionItems(parent.dataType);
  }

  protected onParentConditionChange = async (item: FrFormControlChangeResult<number, Event>): Promise<void> => {
    if (!item.value) {
      return;
    }

    this.selectedParentCondition = item.value;
    this.parentValueValidators = {};

    item.value !== this.hasNoConditionValue

    if (item.value !== this.hasNoConditionValue) {
      this.setParentValueValidation();
    }
  }

  protected onAddOrUpdate = async (): Promise<void> => {
    const formSubmit = await this.form.onSubmit();
    const { isValid, data } = formSubmit;

    if (!isValid || !data) {
      return;
    }

    data.name = data.name.clean();

    const sameNameExsited = this.customFields.find((cf: CustomFieldGroupCustomFieldForm) => cf.name.clean() === data.name)
    if (sameNameExsited && this.selectedUniqueId != sameNameExsited.uniqueId) {
      alert(`There is already an Custom Field with name (${data.name}) ...`);
      return;
    }

    if (this.operation === 'Update') {
      const customFieldIndex = this.customFields.findIndex((cf: CustomFieldGroupCustomFieldForm) => cf.uniqueId === this.selectedUniqueId);
      if (customFieldIndex < 0) {
        return;
      }

      this.customFields[customFieldIndex] = { ...this.customFields[customFieldIndex], ...data };
    }
    else {
      data.uniqueId = uuidv4();
      this.customFields.push(data);
    }

    await this.onResetModel();
  }

  protected onRemove = async (): Promise<void> => {
    if (this.operation === 'AddNew' || !this.selectedUniqueId) {
      return;
    }

    const customFieldIndex = this.customFields.findIndex((cf: CustomFieldGroupCustomFieldForm) => cf.uniqueId === this.selectedUniqueId);
    if (customFieldIndex < 0) {
      return;
    }

    this.customFields.splice(customFieldIndex, 1);

    await this.onResetModel();
  }

  protected onSelectForUpdate = async (item: ExtendedCustomFieldGroupCustomFieldForm): Promise<void> => {
    debugger;
    if (!this.form || !item) {
      return;
    }

    this.operation = 'Update';

    this.applyCurrentDate = item.applyCurrentDate ?? false;

    this.selectedUniqueId = item.uniqueId;
    this.selectedDataType = item.dataType;

    this.selectedParentDataType = undefined;
    this.selectedParentUniqueId = undefined;

    if (item.dataType === CustomFieldDataTypeEnum.Date && !!item.applyCurrentDate) {
      item.initialValueDate = this.nowDate;
    }

    if (item.parentUniqueId) {
      const parent = this.customFields.find((cf: CustomFieldGroupCustomFieldForm) => cf.uniqueId == item.parentUniqueId);
      if (parent) {
        this.selectedParentDataType = parent.dataType;
        this.selectedParentUniqueId = parent.uniqueId;
        this.selectedParentCondition = item.parentConditionOperand ?? this.hasNoConditionValue;

        if (parent.dataType === CustomFieldDataTypeEnum.Date && !!item.parentConditionOperand) {
          item.parentValueDate = this.nowDate;
        }

        this.parentConditionItems = this.loadParentConditionItems(parent.dataType);
      }
    }

    this.parentItems = this.loadParentItems();
    await this.form.setModel(item);
  }

  protected onCancelUpdate = async (): Promise<void> => {
    await this.onResetModel();
  }

  protected trackByIdentifier = (index: number, item: ExtendedCustomFieldGroupCustomFieldForm): string => {
    return item.uniqueId + '-' + (index + 1);
  }
  //#endregion

  //#region Accessors
  protected get customFieldDataType(): typeof CustomFieldDataTypeEnum {
    return CustomFieldDataTypeEnum;
  }

  protected get customFieldResource(): CustomFieldResource {
    return this.applicationLocalizationService.resource.customFieldResource;
  }

  protected get customFieldGroupResource(): CustomFieldGroupResource {
    return this.applicationLocalizationService.resource.customFieldGroupResource;
  }
  //#endregion
}
