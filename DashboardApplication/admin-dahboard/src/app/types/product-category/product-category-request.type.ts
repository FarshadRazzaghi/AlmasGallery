import { BaseHttpRequest, PaginationFilter } from "../../helper/http/http.interface.ts.js";

export type ProductCategoryFilter = PaginationFilter & {
  includeCustomFieldGroups?: boolean;
}

export type ProductCategoryRequest = BaseHttpRequest & {
  name: string;
  description: string;
  parentId?: number;
  customFieldGroups: ProductCategoryCustomFieldGroupRequest[];
}

export type ProductCategoryCustomFieldGroupRequest = BaseHttpRequest & {
  customFieldGroupId?: number;
  customFieldGroupLocation?: number;
  isActive: boolean;
}
