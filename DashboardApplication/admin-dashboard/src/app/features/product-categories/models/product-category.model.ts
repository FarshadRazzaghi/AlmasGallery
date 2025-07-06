import { CustomFieldGroupLocationType } from "@core/generated";

export const CustomFieldGroupLocationTypeEnum = {
  PageSection: 1,
  PricingSection: 2,
  DescriptionSection: 3,
} as const;

export interface ProductCategoryCustomFieldGroupForm extends ProductCategoryBase {
  uniqueId: string;
  isActive: boolean;
  order: number;
  customFieldGroupId: number;
  customFieldGroupName: string;
  customFieldGroupLocation: CustomFieldGroupLocationType;
}

export interface ProductCategoryBase { }

export interface ProductCategoryBaseInfo extends ProductCategoryBase {
  id: number;
  name: string;
  parentId?: number;
  description?: string;
}

export interface ProductCategoryCustomFieldGroup extends ProductCategoryBase {
  customFieldGroups: ProductCategoryCustomFieldGroupForm[];
}
