import { Action } from '@ngrx/store';
import { ApiProductDetail } from '../../../../core/services-apis/products/products/models/products';

export const GET_PRODUCTS = '[Products/API] Get products';
export const GET_PRODUCTS_SUCCESS = '[Products/API] Get products success';
export const GET_PRODUCTS_ERROR = '[Products/API] Get products error';
export const SET_PRODUCTS = '[Products/API] Set products';

export class GetProductsAction implements Action {
  readonly type = GET_PRODUCTS;
}

export class GetProductsSuccessAction implements Action {
  readonly type = GET_PRODUCTS_SUCCESS;

  constructor(public products: ApiProductDetail[]) {}
}

export class GetProductsErrorAction implements Action {
  readonly type = GET_PRODUCTS_ERROR;
}

export class SetProductsAction implements Action {
  readonly type = SET_PRODUCTS;

  constructor(public products: ApiProductDetail[]) {}
}
// UTIL ACTIONS

export const PRODUCTS_RESET = '[Products/API] Reset products state';

export class ProductsResetAction implements Action {
  readonly type = PRODUCTS_RESET;
}

export type ProductsActions =
  | GetProductsAction
  | GetProductsSuccessAction
  | GetProductsErrorAction
  | ProductsResetAction
  | SetProductsAction;
