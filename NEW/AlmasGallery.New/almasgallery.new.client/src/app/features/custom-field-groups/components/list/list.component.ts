import { Component, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BaseComponentDirective } from '@core/components';
import { NavigationRoute } from '@core/config';
import { CustomFieldGroupHttpService, CustomFieldGroupResponse } from '@core/generated';
import { CustomFieldGroupResource, HeaderActionButton } from '@core/models';

import { FrCardComponent } from '@fr-widget/sdk/card';
import { FrDataGridColumn, FrDataGridComponent } from '@fr-widget/sdk/data-grid';

import { ExtendedCustomFieldGroupResponse } from '../../models/custom-field-group.model';

@Component({
  standalone: true,
  selector: 'app-cfg-list',
  templateUrl: './list.component.html',
  imports: [
    RouterLink,
    FrCardComponent,
    FrDataGridComponent
  ],
})
export class ListComponent extends BaseComponentDirective {

  @ViewChild('customFieldGroupListDataGrid')
  private dataGrid!: FrDataGridComponent<CustomFieldGroupResponse>;

  //#region Injected Services
  private readonly customFieldGroupHttpService = inject(CustomFieldGroupHttpService);
  //#endregion

  //#region Lifecycle Hooks
  protected override async afterViewInit(): Promise<void> {
    setTimeout(async () => {
      this.documentService.setButtons(this.actionButtons);
      await this.loadCustomFieldGroups();
    })
  }
  //#endregion

  //#region Load & Map Data
  private async loadCustomFieldGroups(): Promise<void> {
    try {
      const response = await this.customFieldGroupHttpService.getAllCustomFieldGroups();
      if (response.status) {
        const groups = response.data ?? [];
        const enrichedGroups = this.mapCustomFieldsToString(groups);
        this.dataGrid.setRecords(enrichedGroups);
      }
    } catch (error) {
      console.error('[CustomFieldGroupListComponent] Failed to load custom field groups:', error);
    }
  }

  private mapCustomFieldsToString(
    groups: CustomFieldGroupResponse[]
  ): ExtendedCustomFieldGroupResponse[] {
    return groups.map(group => ({
      ...group,
      stringCustomFields: group.customFields.map(cf => cf.name).join('، '),
    }));
  }
  //#endregion

  //#region Accessors
  protected get actionButtons(): HeaderActionButton[] {
    return [
      {
        directive: 'link',
        identifierName: 'AddNewCustomFieldGroup',
        color: 'primary',
        text: this.applicationResource.add,
        isVisible: true,
        isEnable: true,
        target: '_self',
        isExternalLink: false,
        routeLink: `${NavigationRoute['customFieldGroups']}/add`,
      },
    ];
  }

  protected get columns(): FrDataGridColumn[] {
    return [
      {
        dataType: 'string',
        field: 'name',
        header: this.customFieldGroupResource.name,
        sortable: true,
        width: 300,
      },
      {
        dataType: 'string',
        field: 'entityType',
        header: this.customFieldGroupResource.entityType,
        sortable: true,
        width: 200,
      },
      {
        dataType: 'string',
        field: 'stringCustomFields',
        header: this.customFieldGroupResource.customFields,
        sortable: true,
        width: 950,
      },
    ];
  }

  protected get customFieldGroupResource(): CustomFieldGroupResource {
    return this.applicationLocalizationService.resource.customFieldGroupResource;
  }
  //#endregion
}
