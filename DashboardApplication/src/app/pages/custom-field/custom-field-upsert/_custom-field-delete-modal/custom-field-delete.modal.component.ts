import { Component, Input, OnDestroy, inject } from '@angular/core';
import { FrModalComponent, FrModalService, FrModalSize } from '@fr-widget/sdk/modal';
import { Subscription } from 'rxjs';

import { _BaseComponent } from '../../../_base.component';

import { Resource } from '../../../../_i18n/resource/resource';
import { LocalizationService } from '../../../../services/localization.service';
import { CustomFieldService } from '../../custom-field.service';

@Component({
  selector: 'custom-field-delete-modal',
  standalone: true,
  imports: [FrModalComponent],
  templateUrl: './custom-field-delete.modal.component.html',
})
export class CustomFieldDeleteModalComponent implements OnDestroy {

  protected get applicationResource(): Resource {
    return this.applicationLocalizationService.resource;
  }

  protected get ModalSize(): typeof FrModalSize {
    return FrModalSize;
  }

  @Input() public errorMessage: string = '';
  @Input() public errorStack: string = '';
  @Input({ required: true }) public id: string = 'custom-field-delete';

  private modalService: FrModalService = inject(FrModalService);
  private customFieldService: CustomFieldService = inject(CustomFieldService);
  private applicationLocalizationService: LocalizationService = inject(LocalizationService);

  private subscription: Subscription;

  constructor() {
    this.subscription = this.modalService
      .onModalSubmit
      .subscribe(async () => {
        const customFieldId = this.customFieldService.customField.id;
        if (customFieldId) {
          this.modalService.setModalLoading(this.id, true);
          var httpResponse = await this.customFieldService.httpService.delete(customFieldId);

          if (httpResponse.status) {
            this.modalService.closeModal(this.id);
            this.customFieldService.deleteCustomField(true);
            return
          }

          setTimeout(() => {
            this.modalService.setModalLoading(this.id, false);
          })
        }
      })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
