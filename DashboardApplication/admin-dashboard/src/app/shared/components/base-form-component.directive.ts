import { Directive, inject } from '@angular/core';
import { takeUntil } from 'rxjs';

import { BaseComponentDirective } from '@core/components';
import { ConditionResource } from '@core/models';

import { FrFormControlValidator } from '@fr-widget/sdk/form';

import { FormHandlerService } from '../services';

@Directive()
export abstract class BaseFormComponentDirective<T> extends BaseComponentDirective {

  //#region Injected Services
  protected readonly formHandlerService = inject(FormHandlerService<T>);
  //#endregion

  //#region State
  private firstSubscription: boolean = true;

  protected abstract onSubmitForm(): Promise<void>;
  protected abstract onSetModel(model: T | undefined): Promise<void>;
  protected abstract onResetModel(model: T): Promise<void>;
  //#endregion

  //#region Lifecycle Hooks
  protected override onInit(): void {
    const expectedIds = this.formHandlerService.getExpectedIds();
    const duplicatedId = expectedIds.find(x => x === this.id);
    if (duplicatedId) {
      throw new Error(`Duplicated Form: There is Already a Form with id: '${this.id}' in this current application's page.`)
    }

    this.formHandlerService.registerChild(this.id);
    this.formHandlerService.submitSignal$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async () => {
        this.onSubmitForm();
      });

    const subscription = this.formHandlerService.models$
      .subscribe(async models => {
        if (this.firstSubscription) {
          this.firstSubscription = false;
          return;
        }

        const model = models.get(this.id);
        if (!model) {
          return;
        }

        this.onSetModel(model);
        subscription.unsubscribe();
      });
  }

  protected override onDestroy(): void {
    super.onDestroy();
    this.formHandlerService.unregisterChild(this.id);
  }
  //#endregion

  //#region Accessors
  protected get conditionResource(): ConditionResource {
    return this.applicationResource.conditionResource;
  }

  protected get isRequired(): FrFormControlValidator {
    return {
      required: true
    }
  }

  protected get isRtl(): boolean {
    return this.applicationLocalizationService.isRTL;
  }
  //#endregion
}
