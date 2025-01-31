import { Component, ElementRef, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FrBaseComponent } from '@fr-widget/sdk';

import { Resource } from '../_i18n/resource/resource';
import { DocumentService } from '../services/document.service';
import { LocalizationService } from '../services/localization.service';

import * as FrI18N from '@fr-widget/i18n';

@Component({
	selector: 'app-base',
	standalone: true,
	imports: [],
	template: '',
	encapsulation: ViewEncapsulation.None,
})
export abstract class _BaseComponent extends FrBaseComponent {

	protected get applicationResource(): Resource {
		return this.applicationLocalizationService.resource;
	}

	protected applicationLocalizationService: LocalizationService = inject(LocalizationService);
	protected applicationDocumentService: DocumentService = inject(DocumentService);
	private frI18NService: FrI18N.FrLocalizationService = inject(FrI18N.FrLocalizationService);

	//protected abstract actionButtons: HeaderActionButton[];

	protected changingLanguage: boolean;
	protected changeLanguageSubscription: Subscription;

	constructor(elementRef: ElementRef) {
		super(elementRef);

		this.changingLanguage = false;

		this.changeLanguageSubscription = this.frI18NService
			.languageChange
			.subscribe(async () => {
				this.changingLanguage = true;

				setTimeout(async () => {
					this.onLanguageChange();
					//this.productCategoryCustomFieldLocationItems = await this.getCustomFieldGroupLocationTypes();
					this.changingLanguage = false;
				})
			})
	}

	protected override onChanges(changes: SimpleChanges): void {
		if (changes) {
			// throw new Error('Method not implemented.');
		}
	}

	protected override onInit(): void {
		//this.applicationDocumentService.setButtons([]);
		//this.applicationDocumentService.setButtons(this.actionButtons);
	}

	protected override doCheck(): void {
		// throw new Error('Method not implemented.');
	}

	protected override afterContentInit(): void {
		// throw new Error('Method not implemented.');
	}

	protected override afterContentChecked(): void {
		// throw new Error('Method not implemented.');
	}

	protected override afterViewInit(): void {
		// throw new Error('Method not implemented.');
	}

	protected override afterViewChecked(): void {
		// throw new Error('Method not implemented.');
	}

	protected override onDestroy(): void {
		console.log('_BaseComponent.onDestroy()');
		this.applicationDocumentService.setButtons([]);
		this.changeLanguageSubscription.unsubscribe();
	}

	protected override onLanguageChange(): void {
		// throw new Error('Method not implemented.');
	}

	protected override onResize(): void {
		//throw new Error('Method not implemented.');
	}
}
