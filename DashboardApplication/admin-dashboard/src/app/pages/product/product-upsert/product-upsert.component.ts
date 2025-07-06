// TODO - REMOVE THIS FILE AFTER TESTING
// import { Component, ElementRef, ViewEncapsulation, inject } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { FrWidgetError } from '@fr-widget/sdk';

// import { _ProductBaseComponent } from '../_product.base.component';
// import { HeaderActionButton } from '../../../types/button.interface';

// import { ProductInformationComponent } from './product-information/product-information.component';
// import { ProductImageComponent } from './product-image/product-image.component';
// import { ProductPricingComponent } from './product-pricing/product-pricing.component';
// import { ProductOrganizeComponent } from './product-organize/product-organize.component';
// import { ProductVariantComponent } from './product-variant/product-variant.component';
// import { ProductInventoryComponent } from './product-inventory/product-inventory.component';

// import * as FrCard from '@fr-widget/sdk/card';
// import * as FrForm from '@fr-widget/sdk/form';

// @Component({
// 	selector: 'product-upsert',
// 	standalone: true,
// 	imports: [
// 		FrForm.FrFormComponent,
// 		FrForm.FrFormControlComponent,
// 		FrForm.FrFormControlDirectiveModule,

// 		FrCard.FrCardComponent,
// 		FrCard.FrCardHeaderComponent,
// 		FrCard.FrCardFooterComponent,

// 		ProductInformationComponent,
// 		ProductImageComponent,
// 		ProductPricingComponent,
// 		ProductOrganizeComponent,
// 		ProductVariantComponent,
// 		ProductInventoryComponent
// 	],
// 	templateUrl: './product-upsert.component.html',
// 	encapsulation: ViewEncapsulation.None,
// 	providers: [ProductService]
// })
// export class ProductUpsertComponent extends _ProductBaseComponent {

// 	protected get actionButtons(): HeaderActionButton[] {
// 		const actionButtons: HeaderActionButton[] = [
// 			{
// 				directive: 'waiting',
// 				color: 'success',
// 				identifierName: 'Submit',
// 				type: 'submit',
// 				text: '',
// 				isVisible: true,
// 				isEnable: true,
// 				isWaiting: false,
// 				onClick: () => this.onSubmit(),
// 			},
// 			{
// 				directive: 'link',
// 				color: 'primary',
// 				identifierName: 'BackToList',
// 				text: '',
// 				isVisible: true,
// 				isEnable: true,
// 				target: '_self',
// 				isExternalLink: false,
// 				routeLink: '/products'
// 			}
// 		];

// 		Object.defineProperties(actionButtons.find(x => x.identifierName === 'BackToList'), {
// 			text: {
// 				get: () => { return this.applicationLocalizationService.resource.backToPrevious; }
// 			}
// 		});

// 		Object.defineProperties(actionButtons.find(x => x.identifierName === 'Submit'), {
// 			isWaiting: {
// 				get: () => { return this.isSubmitting; }
// 			},
// 			text: {
// 				get: () => { return this.applicationLocalizationService.resource.submit; }
// 			}
// 		});

// 		return actionButtons;
// 	}

// 	protected productHttpService: ProductHttpService = inject(ProductHttpService);
// 	protected productLoaded: boolean;

// 	private productId?: number;
// 	private operation: 'AddNew' | 'Update';
// 	private isSubmitting: boolean;

// 	constructor(
// 		private activatedRoute: ActivatedRoute,
// 		private productService: ProductService,
// 		elementRef: ElementRef) {
// 		super(elementRef);

// 		this.operation = 'AddNew';
// 		this.isSubmitting = false;
// 		this.productLoaded = false;

// 		const param = this.activatedRoute.snapshot.paramMap.get('id');
// 		if (param) {
// 			const castedParam = +param;
// 			if (isNaN(castedParam)) {
// 				// TODO - REDIRECT TO 404 NOT FOUND PAGE;
// 				throw new FrWidgetError("PAGE NOT  FOUND");
// 			}

// 			this.productId = castedParam;
// 			this.operation = 'Update';
// 		}
// 	}

// 	protected override onInit(): void {
// 		this.applicationDocumentService.setButtons(this.actionButtons);
// 	}

// 	protected override afterViewInit(): void {
// 		setTimeout(async () => {
// 			this.productLoaded = false;

// 			if ((this.productId || this.productId == 0) && this.operation === 'Update') {
// 				const product = await this.productHttpService.getSingle(this.productId);
// 				if (!product || !product.data) {
// 					// TODO - REDIRECT TO 404 NOT FOUND PAGE;
// 					throw new FrWidgetError("PAGE NOT  FOUND");
// 				}

// 				this.productService.product = convertToModel(product.data);
// 			}

// 			this.productLoaded = true;
// 		})
// 	}

// 	protected override onDestroy(): void {
// 		this.productService.product = {};
// 		this.applicationDocumentService.clearFormResult();

// 		super.onDestroy();
// 	}

// 	protected onSubmit = (): void => {
// 		this.applicationDocumentService.validateForm();

// 		setTimeout(async () => {
// 			this.isSubmitting = true;

// 			const formSubmitResults = this.applicationDocumentService.getResults();
// 			if (formSubmitResults.length > 0) {
// 				const canSubmit = formSubmitResults.map(x => x.result).every(x => x);

// 				if (canSubmit) {
// 					let result: BaseHttpResponse<ProductUpsertRequest | null> = { status: false };
// 					const requestModel = convertToRequest(this.productService.product);

// 					if (this.operation === 'AddNew') {
// 						result = await this.productHttpService.create(requestModel);
// 					}
// 					else {
// 						result = await this.productHttpService.update(this.productId ?? 0, requestModel);
// 					}

// 					if (result) {
// 						console.log(result);
// 					}
// 				}

// 				this.isSubmitting = false;
// 			}
// 		})
// 	}
// }
