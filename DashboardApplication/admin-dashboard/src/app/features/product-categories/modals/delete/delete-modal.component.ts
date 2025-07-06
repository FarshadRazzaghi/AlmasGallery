import { Component, inject } from '@angular/core';

import { BaseHttpResponse, ProductCategoryHttpService } from '@core/generated';
import { BaseDeleteModalDirectiveDirective } from '@shared/components';

import { FrModalComponent } from '@fr-widget/sdk/modal';

@Component({
  standalone: true,
  selector: 'app-pc-delete-modal',
  templateUrl: './delete-modal.component.html',
  imports: [FrModalComponent]
})
export class DeleteModalComponent extends BaseDeleteModalDirectiveDirective<number> {

  //#region Injected Services
  private readonly productCategoryHttpService = inject(ProductCategoryHttpService);
  //#endregion

  //#region Lifecycle Hooks
  protected override onDeleteSuccess(): void { }

  protected override async onNotFound(): Promise<void> {
    alert('Product Category not found');
  }

  protected override async deleteEntityById(id: number): Promise<void> {
    const httpResponse: BaseHttpResponse<void> = await this.productCategoryHttpService.deleteProductCategoryById(id as number);
    if (!httpResponse.status) {
      alert(httpResponse.message);
      this.modalService.setModalLoading(this.id, false);
      return;
    }
  }
  //#endregion
}
