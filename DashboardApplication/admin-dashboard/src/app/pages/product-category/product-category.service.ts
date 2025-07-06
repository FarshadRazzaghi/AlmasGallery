import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ProductCategoryHttpService } from '../../generated/services/product-category.service.generator';
import { ProductCategoryResponse } from '../../generated/api-schematics.generator';

@Injectable()
export class ProductCategoryService {

	private _productCategoryHttpService: ProductCategoryHttpService = inject(ProductCategoryHttpService);
	public get httpService() {
		return this._productCategoryHttpService;
	}

	private _productCategory: ProductCategoryResponse = {};
	public set productCategory(productCategory: ProductCategoryResponse) {
		this._productCategory = productCategory;
	}
	public get productCategory() {
		return this._productCategory;
	}

	private _resetProductCategory = new BehaviorSubject<boolean>(false);
	public productCategoryReset = this._resetProductCategory.asObservable();
	public resetProductCategory = (option: boolean): void => {
		this._resetProductCategory.next(option);
	}

	private _deleteProductCategory = new BehaviorSubject<boolean>(false);
	public productCategoryDelete = this._deleteProductCategory.asObservable();
	public deleteProductCategory = (option: boolean): void => {
		this._deleteProductCategory.next(option);
	}
}
