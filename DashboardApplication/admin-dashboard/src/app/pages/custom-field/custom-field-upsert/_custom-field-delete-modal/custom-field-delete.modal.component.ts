import { Component, Input, OnDestroy, inject } from '@angular/core';
import { FrModalComponent, FrModalService, FrModalSize } from '@fr-widget/sdk/modal';
import { Subscription } from 'rxjs';

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

	@Input() public errorMessage: string;
	@Input() public errorStack: string;
	@Input({ required: true }) public id: string;

	private modalService: FrModalService = inject(FrModalService);
	private customFieldService: CustomFieldService = inject(CustomFieldService);
	private applicationLocalizationService: LocalizationService = inject(LocalizationService);

	private subscription: Subscription;

	constructor() {
		this.errorMessage = '';
		this.errorStack = '';
		this.id = 'custom-field-delete';

		this.subscription = this.modalService
			.onModalSubmit
			.subscribe(async () => {
				const customFieldId = this.customFieldService.customFieldGroup.id;
				if (customFieldId) {
					this.modalService.setModalLoading(this.id, true);
					const httpResponse = await this.customFieldService.httpService.deleteCustomFieldGroupById(customFieldId);

					if (httpResponse.status) {
						this.customFieldService.deleteCustomFieldGroup(true);
						return;
					}

					setTimeout(() => {
						this.modalService.closeModal(this.id);
						this.modalService.setModalLoading(this.id, false);
					})
				}
			})
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
