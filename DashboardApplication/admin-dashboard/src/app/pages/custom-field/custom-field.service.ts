import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v7 as uuid } from 'uuid';

import { CustomFieldGroupsHttpService } from '../../generated/services/custom-field-groups.service.generator';
import { CustomFieldGroup } from '../../types/custom-field/custom-field-upsert.type';

@Injectable()
export class CustomFieldService {

	private _newCustomFieldGroup: CustomFieldGroup = {
		uniqueId: uuid(),
		id: 0,
		entityType: 1,
		name: '',
		customFields: [],
	};

	private _customFieldGroupHttpService: CustomFieldGroupsHttpService = inject(CustomFieldGroupsHttpService);
	public get httpService() {
		return this._customFieldGroupHttpService;
	}

	private _customFieldGroup: CustomFieldGroup = this._newCustomFieldGroup;
	public set customFieldGroup(customFieldGroup: CustomFieldGroup) {
		this._customFieldGroup = customFieldGroup;
	}
	public get customFieldGroup() {
		return this._customFieldGroup;
	}

	public clearCustomFieldGroup = () => {
		this._customFieldGroup = this._newCustomFieldGroup;
	}

	private _resetCustomFieldGroup = new BehaviorSubject<boolean>(false);
	public customFieldGroupReset = this._resetCustomFieldGroup.asObservable();
	public resetCustomFieldGroup = (option: boolean): void => {
		this._resetCustomFieldGroup.next(option);
	}

	private _deleteCustomFieldGroup = new BehaviorSubject<boolean>(false);
	public customFieldGroupDelete = this._deleteCustomFieldGroup.asObservable();
	public deleteCustomFieldGroup = (option: boolean): void => {
		this._deleteCustomFieldGroup.next(option);
	}
}
