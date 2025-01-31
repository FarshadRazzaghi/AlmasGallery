import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CustomFieldUpsert } from '../../types/custom-field/custom-field-upsert.type';
import { CustomFieldHttpService } from '../../services/http/custom-field/custom-field.http.service';

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

  private _resetCustomField = new BehaviorSubject<boolean>(false);
  public customFieldReset = this._resetCustomField.asObservable();
  public resetCustomField = (option: boolean): void => {
    this._resetCustomField.next(option);
  }

  private _deleteCustomField = new BehaviorSubject<boolean>(false);
  public customFieldDelete = this._deleteCustomField.asObservable();
  public deleteCustomField = (option: boolean): void => {
    this._deleteCustomField.next(option);
  }
}
