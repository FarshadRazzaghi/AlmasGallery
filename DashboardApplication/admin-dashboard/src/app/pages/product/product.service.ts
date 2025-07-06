// TODO - remove this file when the new product page is ready

// import { inject, Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// import { ProductCategoryHttpService } from '../../generated/services/product-category.service.generator';
// import { CustomFieldGroupsHttpService } from '../../generated/services/custom-field-groups.service.generator';

// @Injectable()
// export class ProductService {

// 	private _productHttpService: ProductHttpService = inject(ProductHttpService);
// 	public get httpService() {
// 		return this._productHttpService;
// 	}

// 	private _productCategoryHttpService: ProductCategoryHttpService = inject(ProductCategoryHttpService);
// 	public get productCategoryHttpService() {
// 		return this._productCategoryHttpService;
// 	}

// 	private _customFieldGroupHttpService: CustomFieldGroupsHttpService = inject(CustomFieldGroupsHttpService);
// 	public get customFieldGroupHttpService() {
// 		return this._customFieldGroupHttpService;
// 	}

// 	private _product: ProductUpsert = {};
// 	public set product(product: ProductUpsert) {
// 		this._product = product;
// 	}
// 	public get product() {
// 		return this._product;
// 	}

// 	private _customFields: CustomFieldRequest[] = [];
// 	public set customFields(customFields: CustomFieldRequest[]) {
// 		this._customFields = customFields;
// 	}
// 	public get customFields() {
// 		return this._customFields;
// 	}

// 	private _resetProduct = new BehaviorSubject<boolean>(false);
// 	public productReset = this._resetProduct.asObservable();
// 	public resetProduct = (option: boolean): void => {
// 		this._resetProduct.next(option);
// 	}

// 	private _deleteProduct = new BehaviorSubject<boolean>(false);
// 	public productDelete = this._deleteProduct.asObservable();
// 	public deleteProduct = (option: boolean): void => {
// 		this._deleteProduct.next(option);
// 	}
// }
