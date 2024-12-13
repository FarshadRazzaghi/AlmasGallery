import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { HeaderActionButton } from '../types/button.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private _headerButtonsSource = new BehaviorSubject<HeaderActionButton[]>([]);
  public headerButtons = this._headerButtonsSource.asObservable();
  public setButtons = (buttons: HeaderActionButton[]): void => {
    this._headerButtonsSource.next(buttons);
  }

  private _formResults: { formId: string, result: boolean }[] = [];
  public clearFormResult = (): void => {
    this._formResults = [];
  }
  public addResult = (formId: string, result: boolean): void => {
    const exsitedIndex = this._formResults.findIndex(x => x.formId === formId);
    if (exsitedIndex === -1) {
      this._formResults.push({ formId: formId, result: result });
      return;
    }

    this._formResults[exsitedIndex].result = result;
  }
  public getResults = (): { formId: string, result: boolean }[] => {
    return this._formResults;
  }

  private _validateForm = new BehaviorSubject<unknown>(null);
  public formValidation = this._validateForm.asObservable();
  public validateForm = (): void => {
    this._validateForm.next(null);
  }
}
