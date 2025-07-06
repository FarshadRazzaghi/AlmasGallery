import { NgIf } from '@angular/common';
import { Component, ElementRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponentDirective } from '@core/components';
import { NavigationRoute } from '@core/config';
import { CustomFieldGroupResource, HeaderActionButton } from '@core/models';
import { TitleService } from '@core/services';

import { ModalDeleteConfirmation } from '@shared/models';
import { FormHandlerService } from '@shared/services';

import {
  BaseHttpResponse,
  CustomFieldGroupHttpService,
  CustomFieldGroupRequest,
  CustomFieldGroupResponse,
  CustomFieldResponse,
} from '@core/generated';

import { FrCardComponent } from '@fr-widget/sdk/card';
import { FrModalService } from '@fr-widget/sdk/modal';

import { DeleteModalComponent } from '../../modals/delete/delete-modal.component';
import { BaseInfoComponent } from './base-info/base-info.component';
import { CustomFieldComponent } from './custom-field/custom-field.component';
import {
  CustomFieldGroupBase,
  CustomFieldGroupBaseInfo,
  CustomFieldGroupCustomField,
  CustomFieldGroupCustomFieldForm
} from '../../models/custom-field-group.model';

@Component({
  standalone: true,
  selector: 'app-cfg-upsert',
  templateUrl: './upsert.component.html',
  imports: [
    BaseInfoComponent,
    CustomFieldComponent,
    DeleteModalComponent,
    FrCardComponent,
    NgIf
  ],
})
export class UpsertComponent extends BaseComponentDirective {

  //#region Injected Services
  private readonly titleService = inject(TitleService);
  private readonly customFieldGroupHttpService = inject(CustomFieldGroupHttpService);
  private readonly formHandlerService = inject(FormHandlerService<CustomFieldGroupBase>);
  private readonly modalService = inject(FrModalService);
  //#endregion

  //#region State
  protected operation: 'AddNew' | 'Update' = 'AddNew';
  protected loadForm: boolean = false;
  protected customFieldGroupId: number | undefined;

  protected customFieldGroupBaseInfoId: string = 'customFieldGroupBaseInfoForm';
  protected customFieldGroupCustomFieldFormId: string = 'customFieldGroupCustomFieldForm';
  protected customFieldGroupDeleteModalId: string = 'customFieldGroupDeleteModal';

  private isSubmitting: boolean = false;
  private listRoute: string = `${NavigationRoute['dashboard']}/${NavigationRoute['customFieldGroups']}`;
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
      this.themeService.setTargetRoute(`/${this.listRoute}`);
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

    let baseInfo: CustomFieldGroupBaseInfo | undefined;
    let customField: CustomFieldGroupCustomField | undefined;

    if (idParam) {
      const id = Number(idParam);
      if (isNaN(id)) {
        this.router.navigate([this.notFoundRoute]);
        return;
      }

      this.operation = 'Update';
      const httpResponse: BaseHttpResponse<CustomFieldGroupResponse> = await this.customFieldGroupHttpService.getCustomFieldGroupById(id, { retries: 0, cache: true });

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

      const { customFields: cf, entityType, name, id: dataId } = httpResponse.data;
      this.customFieldGroupId = dataId;

      baseInfo = { id: dataId, name: name, entityType: entityType };
      customField = {
        customFields: cf.map((x: CustomFieldResponse) => {
          return {
            id: x.id,
            dataType: x.dataType,
            helpText: x.helpText,
            initialValue: x.initialValue,
            isActive: x.isActive,
            isRequired: x.isRequired,
            name: x.name,
            parentCondition: x.parentCondition,
            parentId: x.parentId,
            placeHolder: x.placeHolder,
            validation: x.validation,
          } as CustomFieldGroupCustomFieldForm
        })
      };

      this.titleService.set(this.applicationResource.routingResource.appManagement.customFieldGroupEditWithParameter.format([name]));
    }

    this.loadForm = true;

    setTimeout(() => {
      this.formHandlerService.setModel(this.customFieldGroupBaseInfoId, baseInfo);
      this.formHandlerService.setModel(this.customFieldGroupCustomFieldFormId, customField);

      this.modalService.setModel(this.customFieldGroupDeleteModalId, this.customFieldGroupId);
      this.modalService.modalResults$
        .subscribe((event) => {
          if (event.modalId === this.customFieldGroupDeleteModalId) {
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

        var httpResponse: BaseHttpResponse<CustomFieldGroupResponse> = { status: false };
        const customFieldGroupRequest = Object.assign({}, ...allResults.map(([_, data]) => data.data)) as CustomFieldGroupRequest;

        if (this.operation === 'AddNew') {
          httpResponse = await this.customFieldGroupHttpService.createCustomFieldGroup(customFieldGroupRequest);
        }

        if (this.operation === 'Update' && this.customFieldGroupId) {
          httpResponse = await this.customFieldGroupHttpService.updateCustomFieldGroupById(this.customFieldGroupId, customFieldGroupRequest);
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
        onClick: () => this.modalService.openModal(this.customFieldGroupDeleteModalId),
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
  protected get customFieldGroupResource(): CustomFieldGroupResource {
    return this.applicationLocalizationService.resource.customFieldGroupResource;
  }
  //#endregion
}
