import { Action } from '@ngrx/store';
import { ApiProductDetail } from '../../../../core/services-apis/products/products/models/products';

export const SET_PRODUCTS = '[Products/API] Set products';

export class SetProductsAction implements Action {
  readonly type = SET_PRODUCTS;

  constructor(public products: ApiProductDetail[]) {}
}
