import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as models from '@core/models';

@Injectable({ providedIn: 'root' })
export class DocumentService {

  // #region Header Action Buttons
  private readonly _headerButtonsSource = new BehaviorSubject<models.HeaderActionButton[]>([]);
  public readonly headerButtons$ = this._headerButtonsSource.asObservable();
  public setButtons(buttons: models.HeaderActionButton[]): void {
    this._headerButtonsSource.next(buttons);
  }
  public getButtonsSnapshot(): models.HeaderActionButton[] {
    return this._headerButtonsSource.getValue();
  }
  public clearButtons(): void {
    this._headerButtonsSource.next([]);
  }
  // #endregion

  // #region Form Results
  private _formResults: { formId: string; result: boolean }[] = [];
  public clearFormResult(): void {
    this._formResults = [];
  }
  public addResult(formId: string, result: boolean): void {
    const index = this._formResults.findIndex(x => x.formId === formId);

    if (index === -1) {
      this._formResults.push({ formId, result });
    } else {
      this._formResults[index].result = result;
    }
  }
  public getResults(): { formId: string; result: boolean }[] {
    return this._formResults;
  }
  // #endregion

  // #region Form Validation Trigger
  private readonly _validationSource = new BehaviorSubject<unknown>(null);
  public readonly validate$ = this._validationSource.asObservable();
  public validateForm(): void {
    this._validationSource.next(null);
  }
  public getValidationSnapshot(): unknown {
    return this._validationSource.getValue();
  }
  // #endregion
}
