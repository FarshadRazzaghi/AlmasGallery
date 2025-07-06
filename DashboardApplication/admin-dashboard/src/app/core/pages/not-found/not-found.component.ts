import { Component, OnDestroy } from '@angular/core';
import { FrCardComponent } from '@fr-widget/sdk/card';
import { BaseComponentDirective } from '../../components';
import { HeaderActionButton } from '../../models';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  imports: [FrCardComponent, RouterLink],
})
export class NotFoundComponent extends BaseComponentDirective implements OnDestroy {

  //#region Lifecycle Hooks
  protected override afterViewInit(): void {
    this.themeService.setTargetRoute('/dashboard');
  }
  //#endregion
}
