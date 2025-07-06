import { Directive, inject, OnDestroy } from '@angular/core';

import { BaseComponentDirective } from '@core/components';

import { FrModalEvent, FrModalService, FrModalSize } from '@fr-widget/sdk/modal';

@Directive()
export abstract class BaseModalComponentDirective extends BaseComponentDirective implements OnDestroy {

  //#region Injected Services
  protected readonly modalService = inject(FrModalService);
  //#endregion

  //#region State
  private firstSubscription: boolean = true;

  protected abstract onSubmitModal(event: FrModalEvent): Promise<void>;
  protected abstract onAfterModalOpened(event: FrModalEvent): Promise<void>;
  //#endregion

  //#region Lifecycle Hooks
  protected override onInit(): void {
    const subscription = this.modalService.onModalSubmit
      .subscribe(async (event) => {
        if (this.firstSubscription) {
          this.firstSubscription = false;
          return;
        }

        if (event.id === this.id) {
          await this.onSubmitModal(event);
          subscription.unsubscribe();
        }
      })
  }

  protected override onDestroy(): void {
    super.onDestroy();
  }
  //#endregion

  //#region Accessors
  protected get ModalSize(): typeof FrModalSize {
    return FrModalSize;
  }

  protected get isRtl(): boolean {
    return this.applicationLocalizationService.isRTL;
  }
  //#endregion
}
