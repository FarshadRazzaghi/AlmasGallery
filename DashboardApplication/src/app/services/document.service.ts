import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
}
