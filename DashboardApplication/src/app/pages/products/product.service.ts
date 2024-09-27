import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { FrFormSubmitResult } from '@fr-widget/sdk/form';

import { AddProduct } from '../../types/products/product.type';
import { ProductRequest } from '../../types/products/http/product-request.type';

@Injectable()
export class ProductService {

  private _product: AddProduct = {}
    ;
  public set product(product: AddProduct) {
    this._product = product;
  }
  public get product() {
    return this._product;
  }

  private _formResults: { formId: string, result: boolean }[] = [];
  public clearFormResult = (): void => {
    this._formResults = [];
  }
  public addResult = (formId: string, result: boolean): void => {
    const exsitedIndex = this._formResults.findIndex(x => x.formId === formId);
    if (exsitedIndex === -1) {
      this._formResults.push({ formId: formId, result: result });
      return;
    }

    this._formResults[exsitedIndex].result = result;
  }
  public getResults = (): { formId: string, result: boolean }[] => {
    return this._formResults;
  }

  private _validateForm = new Subject<null>();
  public formValidation = this._validateForm.asObservable();
  public validateForm = (): void => {
    this._validateForm.next(null);
  }
}
