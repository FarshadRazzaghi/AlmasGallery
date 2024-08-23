import { Injectable, Type } from '@angular/core';
import { ErrorModalComponent } from '../_application/error-handler-modal/error-handler-modal.component';
import { BehaviorSubject } from 'rxjs';

export type ErrorHandler = { component: Type<ErrorModalComponent>, inputs: Record<string, unknown> };

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {

  private _errorSource: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _error!: ErrorHandler;

  public errorMessageChange = this._errorSource.asObservable();

  public setError = (errorMessage: string, errorStack: string | undefined): void => {
    this._error = {
      component: ErrorModalComponent,
      inputs: {
        errorMessage: errorMessage,
        errorStack: errorStack,
      },
    };
    this._errorSource.next(errorMessage);
  }

  public get getError(): ErrorHandler {
    return this._error
  }
}
