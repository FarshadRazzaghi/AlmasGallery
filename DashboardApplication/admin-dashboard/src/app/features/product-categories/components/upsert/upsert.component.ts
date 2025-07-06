import { NgIf } from '@angular/common';
import { Component, ElementRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponentDirective } from '@core/components';
import { HeaderActionButton, ProductCategoryResource } from '@core/models';
import { TitleService } from '@core/services';
import { ModalDeleteConfirmation } from '@shared/models';
import { FormHandlerService } from '@shared/services';

import { NavigationRoute } from '@core/config';
import {
  BaseHttpResponse,
  ProductCategoryCustomFieldGroupResponse,
  ProductCategoryHttpService,
  ProductCategoryRequest,
  ProductCategoryResponse,
} from '@core/generated';

import { FrCardComponent } from '@fr-widget/sdk/card';
import { FrModalService } from '@fr-widget/sdk/modal';

import { DeleteModalComponent } from '../../modals/delete/delete-modal.component';
import { BaseInfoComponent } from './base-info/base-info.component';
import { CustomFieldGroupComponent } from './custom-field-group/custom-field-group.component';
import {
  ProductCategoryBase,
  ProductCategoryBaseInfo,
  ProductCategoryCustomFieldGroup,
  ProductCategoryCustomFieldGroupForm
} from '../../models/product-category.model';

@Component({
  standalone: true,
  selector: 'app-pc-upsert',
  templateUrl: './upsert.component.html',
  imports: [
    BaseInfoComponent,
    CustomFieldGroupComponent,
    DeleteModalComponent,
    FrCardComponent,
    NgIf
  ],
})
export class UpsertComponent extends BaseComponentDirective {

  //#region Injected Services
  private readonly titleService = inject(TitleService);
  private readonly productCategoryHttpService = inject(ProductCategoryHttpService);
  private readonly formHandlerService = inject(FormHandlerService<ProductCategoryBase>);
  private readonly modalService = inject(FrModalService);
  //#endregion

  //#region State
  protected operation: 'AddNew' | 'Update' = 'AddNew';
  protected loadForm: boolean = false;
  protected productCategoryId: number | undefined;

  protected productCategoryBaseInfoFormId: string = 'productCategoryBaseInfoForm';
  protected productCategoryCustomFieldGroupFormId: string = 'productCategoryCustomFieldGroupForm';
  protected productCategoryDeleteModalId: string = 'productCategoryDeleteModal';

  private isSubmitting: boolean = false;
  private listRoute: string = `${NavigationRoute['dashboard']}/${NavigationRoute['productCategory']}`;
  //#endregion

  //#region Lifecycle Hooks
  constructor(
    elementRef: ElementRef,
    protected router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(elementRef, router);
    this.initializeRouteParams(activatedRoute);
  }

  protected override afterViewInit(): void {
    setTimeout(() => {
      this.documentService.setButtons(this.buildActionButtons());
      this.themeService.setTargetRoute(`/${this.listRoute}/add`);
    })
  }

  protected override onDestroy(): void {
    super.onDestroy();
    this.formHandlerService.clear();
  }
  //#endregion

  //#region Initialization
  private async initializeRouteParams(route: ActivatedRoute): Promise<void> {
    const idParam = route.snapshot.paramMap.get('id')?.trim();

    let baseInfo: ProductCategoryBaseInfo | undefined;
    let customFieldGroup: ProductCategoryCustomFieldGroup | undefined;

    if (idParam) {
      const id = Number(idParam);
      if (isNaN(id)) {
        this.router.navigate([this.notFoundRoute]);
        return;
      }

      this.operation = 'Update';
      const httpResponse: BaseHttpResponse<ProductCategoryResponse> = await this.productCategoryHttpService.getProductCategoryById(id, { retries: 0, cache: true });

      if (!httpResponse.status) {
        if (httpResponse.errorCode === 404) {
          this.router.navigate([this.notFoundRoute]);
          return;
        }

        alert(httpResponse.message);
        return;
      }

      if (!httpResponse.data) {
        this.router.navigate([this.notFoundRoute]);
        return;
      }

      const { customFieldGroups: cfg, name, description, parentId, id: dataId } = httpResponse.data;
      this.productCategoryId = dataId;

      baseInfo = { id: dataId, name: name, parentId: parentId, description: description };
      customFieldGroup = {
        customFieldGroups: cfg.map((x: ProductCategoryCustomFieldGroupResponse) => {
          return {
            customFieldGroupId: x.id,
            customFieldGroupLocation: x.location,
            isActive: x.isActive,
            order: x.order,
          } as ProductCategoryCustomFieldGroupForm;
        })
      };

      this.titleService.set(this.applicationResource.routingResource.productManagement.productCategoryEditWithParameter.format([name]));
    }

    this.loadForm = true;

    setTimeout(() => {
      this.formHandlerService.setModel(this.productCategoryBaseInfoFormId, baseInfo);
      this.formHandlerService.setModel(this.productCategoryCustomFieldGroupFormId, customFieldGroup);

      this.modalService.setModel(this.productCategoryDeleteModalId, this.productCategoryId);
      this.modalService.modalResults$
        .subscribe((event) => {
          if (event.modalId === this.productCategoryDeleteModalId) {
            if ((event.result as ModalDeleteConfirmation).isDone) {
              this.router.navigate([this.listRoute]);
            }
          }
        })
    })
  }
  //#endregion

  //#region Event Handlers
  protected onSubmit = (): void => {
    this.formHandlerService.sendSubmitSignal();

    const expectedIds = this.formHandlerService.getExpectedIds();
    if (expectedIds.length === 0) {
      alert('No forms registered for submission.');
      return;
    }

    const subscription = this.formHandlerService.results$
      .subscribe(async results => {
        if (results.size < expectedIds.length) {
          return;
        }

        const allResults = Array.from(results.entries());
        const hasError = allResults.some(([_, data]) => !data.isValid);

        if (hasError) {
          subscription.unsubscribe();
          return;
        }

        this.isSubmitting = true;

        var httpResponse: BaseHttpResponse<ProductCategoryResponse> = { status: false };
        const productCategoryRequest = Object.assign({}, ...allResults.map(([_, data]) => data.data)) as ProductCategoryRequest;

        if (this.operation === 'AddNew') {
          httpResponse = await this.productCategoryHttpService.createProductCategory(productCategoryRequest);
        }

        if (this.operation === 'Update' && this.productCategoryId) {
          httpResponse = await this.productCategoryHttpService.updateProductCategoryById(this.productCategoryId, productCategoryRequest);
        }

        if (!httpResponse.status) {
          alert(httpResponse.message);
          this.isSubmitting = false;
          subscription.unsubscribe();
          return;
        }

        alert('DONE');
        this.isSubmitting = false;
        subscription.unsubscribe();
        this.router.navigate([this.listRoute]);
      });
  }
  //#endregion

  //#region Header Buttons
  private buildActionButtons(): HeaderActionButton[] {
    const actionButtons: HeaderActionButton[] = [
      {
        directive: 'button',
        identifierName: 'Delete',
        text: this.applicationResource.remove,
        color: 'danger',
        type: 'button',
        isVisible: true,
        isEnable: true,
        onClick: () => this.modalService.openModal(this.productCategoryDeleteModalId),
      },
      {
        directive: 'waiting',
        identifierName: 'Submit',
        text: this.applicationResource.submit,
        color: 'success',
        type: 'submit',
        isVisible: true,
        isEnable: true,
        isWaiting: this.isSubmitting,
        onClick: this.onSubmit,
      },
      {
        directive: 'link',
        identifierName: 'BackToList',
        text: this.applicationResource.back,
        color: 'primary',
        target: '_self',
        isExternalLink: false,
        routeLink: `/${this.listRoute}`,
        isVisible: true,
        isEnable: true,
      }
    ];

    Object.defineProperties(actionButtons.find(x => x.identifierName === 'Delete'), {
      isVisible: {
        get: () => { return this.operation === 'Update'; }
      },
      isEnable: {
        get: () => { return !this.isSubmitting; }
      }
    });

    Object.defineProperties(actionButtons.find(x => x.identifierName === 'Submit'), {
      isWaiting: {
        get: () => { return this.isSubmitting; }
      }
    });

    Object.defineProperties(actionButtons.find(x => x.identifierName === 'BackToList'), {
      isEnable: {
        get: () => { return !this.isSubmitting; }
      }
    });

    return actionButtons;
  }
  //#endregion

  //#region Accessors
  protected get productCategoryResource(): ProductCategoryResource {
    return this.applicationLocalizationService.resource.productCategoryResource;
  }
  //#endregion
}
