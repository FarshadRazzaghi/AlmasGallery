import { Directive } from '@angular/core';
import { BaseModalComponentDirective } from './base-modal-component.directive';
import { FrModalEvent } from '@fr-widget/sdk/modal';
import { ModalDeleteConfirmation } from '../models';

@Directive()
export abstract class BaseDeleteModalDirectiveDirective<T> extends BaseModalComponentDirective {

  //#region State
  protected abstract deleteEntityById(id: T): Promise<void>;
  protected abstract onDeleteSuccess(): void;
  protected abstract onNotFound(): Promise<void>;
  //#endregion

  //#region Lifecycle Hooks
  protected override async onSubmitModal(event: FrModalEvent): Promise<void> {
    if (this.id) {
      this.modalService.setModalLoading(this.id, true);
      const result: ModalDeleteConfirmation = { isDone: false };

      const selectedEntity = this.modalService.getModel<T>(this.id);
      if (!selectedEntity) {
        this.onNotFound();
        this.modalService.setModalLoading(this.id, false);
        return;
      }

      await this.deleteEntityById(selectedEntity);

      alert('DONE');
      result.isDone = true;

      this.onDeleteSuccess();
      this.modalService.setModalLoading(this.id, false);
      this.modalService.submitAndClose(this.id, result);
    }
  }

  protected override async onAfterModalOpened(event: FrModalEvent): Promise<void> { }
  //#endregion
}
