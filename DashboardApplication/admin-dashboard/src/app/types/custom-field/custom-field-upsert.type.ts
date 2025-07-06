import { CustomFieldDataType, CustomFieldGroupEntityType } from "../../generated/api-schematics.generator";

export type ValueType = number | string | Date | boolean;

export interface CustomFieldGroup {
	uniqueId: string;
	id: number;
	name: string;
	entityType: CustomFieldGroupEntityType;
	customFields: CustomField[]
}

export interface CustomField {
	uniqueId: string;
	id: number;
	isActive: boolean;
	name: string;
	dataType: CustomFieldDataType;
	helpText?: string;
	placeHolder?: string;
	isRequired: boolean;
	initialValue?: ValueType;
	validation?: string;

	hasParentCondition: boolean;
	parentUniqueId?: string;
	parentId?: number;
	parentCondition?: ValueType;
}

// export const convertToRequest = (model: CustomField): CustomFieldGroupRequest => {
// 	if (!model.name) {
// 		throw Error("Group Name Is Required");
// 	}

// 	return {
// 		name: model.name,
// 		entityType: 1,
// 		customFields: (model || []).map(x => {
// 			return {
// 				id: x.id,
// 				name: x.name,
// 				uniqueId: x.uuid,
// 				isActive: x.isActive,
// 				dataType: x.dataType,
// 				helpText: x.helpText,
// 				placeHolder: x.placeHolder,
// 				initialValue: x.initialValue?.toString(),
// 				isRequired: x.isRequired,
// 				parentUniqueId: x.customFieldParent,
// 				parentCondition: x.parentCondition,
// 				validation: x.validation,
// 			} as CustomFieldRequest
// 		}),
// 	}
// }
