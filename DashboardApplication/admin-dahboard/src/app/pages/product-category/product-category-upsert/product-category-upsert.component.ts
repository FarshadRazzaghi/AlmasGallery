import { Component, ElementRef, ViewEncapsulation, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FrWidgetError } from '@fr-widget/sdk';

import { _ProductCategoryBaseComponent } from '../_product-category.base.component';
import { HeaderActionButton } from '../../../types/button.interface';
import { BaseHttpResponse } from '../../../helper/http/http.interface.ts';

import { ProductCategoryService } from '../product-category.service';

import { ProductCategoryBasicComponent } from './product-category-basic/product-category-basic.component';
import { ProductCategoryCustomFieldComponent } from './product-category-custom-field/product-category-custom-field.component';
import { ProductCategoryDeleteModalComponent } from './_product-category-delete-modal/product-category-delete.modal.component';

import { convertToModel, convertToRequest } from '../../../types/product-category/product-category-upsert.type';
import { ProductCategoryRequest } from '../../../types/product-category/product-category-request.type';

import * as FrCard from '@fr-widget/sdk/card';
import * as FrForm from '@fr-widget/sdk/form';
import * as FrModal from '@fr-widget/sdk/modal';

@Component({
  selector: 'product-category-upsert',
  standalone: true,
  imports: [
    FrForm.FrFormComponent,
    FrForm.FrFormControlComponent,
    FrForm.FrFormControlDirectiveModule,

    FrCard.FrCardComponent,
    FrCard.FrCardHeaderComponent,
    FrCard.FrCardFooterComponent,

    ProductCategoryBasicComponent,
    ProductCategoryCustomFieldComponent,
    ProductCategoryDeleteModalComponent,
  ],
  templateUrl: './product-category-upsert.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [ProductCategoryService]
})
export class ProductCategoryUpsertComponent extends _ProductCategoryBaseComponent {

  protected get actionButtons(): HeaderActionButton[] {
    const actionButtons: HeaderActionButton[] = [
      {
        directive: 'button',
        color: 'danger',
        identifierName: 'Delete',
        text: '',
        isVisible: true,
        isEnable: true,
        type: 'button',
        onClick: () => this.modalService.openModal(this.deleteModalId),
      },
      {
        directive: 'waiting',
        color: 'success',
        identifierName: 'Submit',
        type: 'submit',
        text: '',
        isVisible: true,
        isEnable: true,
        isWaiting: false,
        onClick: () => this.onSubmit(),
      },
      {
        directive: 'link',
        color: 'primary',
        identifierName: 'BackToList',
        text: '',
        isVisible: true,
        isEnable: true,
        target: '_self',
        isExternalLink: false,
        routeLink: '/product-categories'
      }
    ];

    Object.defineProperties(actionButtons.find(x => x.identifierName === 'BackToList'), {
      text: {
        get: () => { return this.applicationLocalizationService.resource.backToPrevious; }
      }
    });

    Object.defineProperties(actionButtons.find(x => x.identifierName === 'Submit'), {
      isWaiting: {
        get: () => { return this.isSubmitting; }
      },
      text: {
        get: () => { return this.applicationLocalizationService.resource.submit; }
      }
    });

    Object.defineProperties(actionButtons.find(x => x.identifierName === 'Delete'), {
      isVisible: {
        get: () => { return this.operation === 'Update'; }
      },
      text: {
        get: () => { return this.applicationLocalizationService.resource.remove; }
      }
    });

    return actionButtons;
  }

  // #region Fields
  private modalService: FrModal.FrModalService = inject(FrModal.FrModalService);
  //private productCategoryHttpService: ProductCategoryHttpService = inject(ProductCategoryHttpService);

  protected deleteModalId: string;
  protected productCategoryLoaded: boolean;
  protected operation: 'AddNew' | 'Update'

  private productCategoryId?: number;
  private isSubmitting: boolean;

  private deleteSubscription: Subscription;
  // #endregion Fields

  constructor(elementRef: ElementRef, private activatedRoute: ActivatedRoute, private productCategoryService: ProductCategoryService, private router: Router) {
    super(elementRef);

    this.operation = 'AddNew';
    this.deleteModalId = 'product-category-delete';
    this.productCategoryLoaded = false;
    this.isSubmitting = false;

    const param = this.activatedRoute.snapshot.paramMap.get('id');

    if (param) {
      const castedParam = +param;
      if (isNaN(castedParam)) {
        // TODO - REDIRECT TO 404 NOT FOUND PAGE;
        throw new FrWidgetError("PAGE NOT  FOUND");
      }

      this.productCategoryId = castedParam;
      this.operation = 'Update';
    }

    this.deleteSubscription = this.productCategoryService
      .productCategoryDelete
      .subscribe((value: boolean) => {
        if (value) {
          this.isSubmitting = false;
          this.productCategoryService.resetProductCategory(true);
          this.router.navigate(['product-categories']);
        }
      })
  }

  protected override onInit(): void {
    this.applicationDocumentService.setButtons(this.actionButtons);
  }

  protected override afterViewInit(): void {
    setTimeout(async () => {
      this.productCategoryLoaded = false;

      if ((this.productCategoryId || this.productCategoryId == 0) && this.operation === 'Update') {
        const productCategory = await this.productCategoryService.httpService.getSingle(this.productCategoryId);
        if (!productCategory || !productCategory.data) {
          // TODO - REDIRECT TO 404 NOT FOUND PAGE;
          throw new FrWidgetError("PAGE NOT  FOUND");
        }

        this.productCategoryService.productCategory = convertToModel(productCategory.data);
      }

      this.productCategoryLoaded = true;
    })
  }

  protected override onDestroy(): void {
    this.productCategoryService.productCategory = {};
    this.applicationDocumentService.clearFormResult();

    this.deleteSubscription.unsubscribe();

		super.onDestroy();
  }

  protected onSubmit = (): void => {
    this.applicationDocumentService.validateForm();

    setTimeout(async () => {
      this.isSubmitting = true;

      const formSubmitResults = this.applicationDocumentService.getResults();
      if (formSubmitResults.length > 0) {
        const canSubmit = formSubmitResults.map(x => x.result).every(x => x);

        if (canSubmit) {
          let httpResponse: BaseHttpResponse<ProductCategoryRequest | null> = { status: false };
          const requestModel = convertToRequest(this.productCategoryService.productCategory);

          if (this.operation === 'AddNew') {
            httpResponse = await this.productCategoryService.httpService.create(requestModel);
          }
          else {
            httpResponse = await this.productCategoryService.httpService.update(this.productCategoryId ?? 0, requestModel);
          }

          if (httpResponse && httpResponse.status) {
            this.isSubmitting = false;
            this.productCategoryService.resetProductCategory(true);
            this.router.navigate(['product-categories']);
          }
        }

        this.isSubmitting = false;
      }
    })
  }
}
