// import { CustomFieldDataType, CustomFieldGroupEntityType, CustomFieldGroupLocationType } from "../../generated/api-interface.generator";
// import { ProductCategoryCustomFieldGroupRequest, ProductCategoryRequest } from "./product-category-request.type"

// export interface ProductCategoryUpsertCustomField {
// 	id?: number;
// 	uuid: string;
// 	isActive: boolean;
// 	customFieldGroup: number;
// 	customFieldLocation: number;
// }

// export interface ProductCategoryUpsert {
// 	id?: number;
// 	name?: string;
// 	description?: string;
// 	parentId?: number;
// 	customFieldGroups?: ProductCategoryUpsertCustomField[];
// }

// export type ProductCategoryUpsertBasic = Pick<ProductCategoryUpsert, "name" | "description" | "parentId">;

// export const convertToRequest = (model: ProductCategoryUpsert): ProductCategoryRequest => {
// 	if (!model.name) {
// 		throw Error("Name Is Required");
// 	}

// 	if (!model.description) {
// 		throw Error("Description Is Required");
// 	}

// 	return {
// 		id: model.id,
// 		name: model.name,
// 		description: model.description,
// 		parentId: model.parentId,
// 		customFieldGroups: (model.customFieldGroups || []).map(x => {
// 			return {
// 				id: x.id,
// 				customFieldGroupId: x.customFieldGroup,
// 				customFieldGroupLocation: x.customFieldLocation,
// 				isActive: x.isActive,
// 			} as ProductCategoryCustomFieldGroupRequest
// 		})
// 	}
// }

// export const convertToModel = (request: ProductCategoryRequest): ProductCategoryUpsert => {
// 	return {
// 		id: request.id,
// 		description: request.description,
// 		name: request.name,
// 		parentId: request.parentId,
// 		customFieldGroups: (request.customFieldGroups ?? [])
// 			.map(x => {
// 				return {
// 					id: x.id,
// 					customFieldGroup: x.customFieldGroupId,
// 					customFieldLocation: x.customFieldGroupLocation,
// 					isActive: x.isActive
// 				} as ProductCategoryUpsertCustomField
// 			})
// 	}
// }
