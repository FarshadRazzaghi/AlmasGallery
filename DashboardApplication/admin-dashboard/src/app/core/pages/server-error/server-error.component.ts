import { Component, OnDestroy } from '@angular/core';
import { FrCardComponent } from '@fr-widget/sdk/card';
import { BaseComponentDirective } from '../../components';
import { HeaderActionButton } from '../../models';

@Component({
  standalone: true,
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  imports: [FrCardComponent],
})
export class ServerErrorComponent extends BaseComponentDirective implements OnDestroy {

  //#region Lifecycle Hooks
  protected override afterViewInit(): void {
    this.documentService.setButtons(this.buildActionButtons());
    this.themeService.setTargetRoute('/dashboard');
  }
  //#endregion

  //#region Header Buttons
  private buildActionButtons(): HeaderActionButton[] {
    const actionButtons: HeaderActionButton[] = [
      {
        directive: 'button',
        identifierName: 'BackToList',
        text: this.applicationResource.back,
        color: 'primary',
        type: 'button',
        onClick: () => history.back(),
        isVisible: true,
        isEnable: true,
      }
    ];

    return actionButtons;
  }
  //#endregion
}
