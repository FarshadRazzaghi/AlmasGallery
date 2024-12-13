import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CustomFieldUpsert, CustomFieldUpsertOption } from '../../types/custom-fields/custom-field-upsert.type';
import { CustomFieldHttpService } from '../../services/http/custom-fields/custom-field-http.service';

@Injectable()
export class CustomFieldService {

  private _customFieldHttpService: CustomFieldHttpService = inject(CustomFieldHttpService);
  public get httpService() {
    return this._customFieldHttpService;
  }

  private _customField: CustomFieldUpsert = {};
  public set customField(customField: CustomFieldUpsert) {
    this._customField = customField;
  }
  public get customField() {
    return this._customField;
  }

  private _updateCustomFieldOption = new BehaviorSubject<CustomFieldUpsertOption | undefined>(undefined);
  public customFieldUpdatation = this._updateCustomFieldOption.asObservable();
  public updateCustomField = (option: CustomFieldUpsertOption): void => {
    this._updateCustomFieldOption.next(option);
  }

  private _resetCustomField = new BehaviorSubject<boolean>(false);
  public customFieldRecitation = this._resetCustomField.asObservable();
  public resetCustomField = (option: boolean): void => {
    this._resetCustomField.next(option);
  }

  private _deleteCustomField = new BehaviorSubject<boolean>(false);
  public customFieldDeletation = this._deleteCustomField.asObservable();
  public deleteCustomField = (option: boolean): void => {
    this._deleteCustomField.next(option);
  }
}
