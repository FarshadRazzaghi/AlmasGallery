import { Component, ElementRef, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CustomFieldHttpService } from '../../../services/http/custom-fields/custom-field-http.service';
import { _CustomFieldBaseComponent } from '../_custom-field.base.component';

import { HeaderActionButton } from '../../../types/button.interface';
import { CustomFieldUpsert } from '../../../types/custom-fields/custom-field-upsert.type';

import * as FrCard from '@fr-widget/sdk/card';
import * as FrDataGrid from '@fr-widget/sdk/data-grid';

@Component({
  selector: 'custom-field-list',
  standalone: true,
  imports: [
    RouterLink,
    FrCard.FrCardComponent,
    FrCard.FrCardHeaderComponent,
    FrCard.FrCardFooterComponent,

    FrDataGrid.FrDataGridComponent,
  ],
  templateUrl: './custom-field-list.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CustomFieldListComponent extends _CustomFieldBaseComponent {

  @ViewChild('customFieldListDataGrid') dataGrid!: FrDataGrid.FrDataGridComponent<CustomFieldUpsert>;

  protected customFieldHttpService: CustomFieldHttpService = inject(CustomFieldHttpService);

  protected get actionButtons(): HeaderActionButton[] {
    const actionButtons: HeaderActionButton[] = [
      {
        directive: 'link',
        color: 'primary',
        identifierName: 'AddNewCustomField',
        text: '',
        isVisible: true,
        isEnable: true,
        target: '_self',
        isExternalLink: false,
        routeLink: '/custom-fields/add'
      }
    ];

    Object.defineProperties(actionButtons.find(x => x.identifierName === 'AddNewCustomField'), {
      text: {
        get: () => { return this.applicationLocalizationService.resource.routingResource.customFieldsAdd; }
      }
    });

    return actionButtons;
  }

  protected get columns(): FrDataGrid.FrDataGridColumn[] {
    return [
      {
        dataType: 'string',
        field: 'name',
        header: this.customFieldResource.groupName,
        sortable: true,
        width: 200
      },
      {
        dataType: 'string',
        field: 'entityType',
        header: this.customFieldResource.groupType,
        sortable: true,
        width: 100
      },
      {
        dataType: 'string',
        field: 'customFields',
        header: 'customFields',
        sortable: true,
        visible: false,
        width: 500
      }
    ];
  }

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  protected override onInit(): void {
    this.applicationDocumentService.setButtons(this.actionButtons);
  }

  protected override async afterViewInit(): Promise<void> {
    var list = await this.customFieldHttpService.getList();
    console.log(list);
    if (list.status) {
      var model = (list.data ?? []);

      setTimeout(() => {
        this.dataGrid.setRecords(model);
      })
    }
  }

  protected override onDestroy(): void {
    this.applicationDocumentService.setButtons([]);
  }

  protected onClick = (record: any): void => {
    console.log(record);
  }
}
