import { ProductBalanceInfo } from '../../../../core/services-apis/products/products-detail/models/GetBalanceRs';
import { Action } from '@ngrx/store';

export const GET_BALANCES = '[Products/API] Get balances';
export const GET_BALANCES_SUCCESS = '[Products/API] Get balances success';
export const GET_BALANCES_ERROR = '[Products/API] Get balances error';
export const ADD_BALANCE = '[Products/API] Add product balance information';

export class GetBalancesAction implements Action {
  readonly type = GET_BALANCES;
}

export class GetBalancesSuccessAction implements Action {
  readonly type = GET_BALANCES_SUCCESS;

  constructor(public balances: any[]) {}
}

export class GetBalancesErrorAction implements Action {
  readonly type = GET_BALANCES_ERROR;
}

export class AddBalanceAction implements Action {
  readonly type = ADD_BALANCE;

  constructor(public balance: ProductBalanceInfo) {}
}

export type BalancesActions =
  GetBalancesAction
  | GetBalancesSuccessAction
  | AddBalanceAction
  | GetBalancesErrorAction;
