import { ProductBalanceInfo } from '../../../../core/services-apis/products/products-detail/models/GetBalanceRs';
import { Action } from '@ngrx/store';

export const GET_CDT_DIGITAL_BALANCES = '[Products/API] Get digital CDT balances';
export const GET_CDT_DIGITAL_BALANCES_SUCCESS = '[Products/API] Get digital CDT balances success';
export const GET_CDT_DIGITAL_BALANCES_ERROR = '[Products/API] Get digital CDT balances error';
export const SET_CDT_DIGITAL_BALANCES = '[Products/API] Set digital CDT balances';

export class GetDigitalCdtBalancesAction implements Action {
  readonly type = GET_CDT_DIGITAL_BALANCES;
}

export class GetDigitalCdtBalancesSuccessAction implements Action {
  readonly type = GET_CDT_DIGITAL_BALANCES_SUCCESS;

  constructor(public digitalCdtBalances: any[]) {}
}

export class GetDigitalCdtBalancesErrorAction implements Action {
  readonly type = GET_CDT_DIGITAL_BALANCES_ERROR;
}

export class SetDigitalCdtBalancesAction implements Action {
  readonly type = SET_CDT_DIGITAL_BALANCES;

  constructor(public digitalCdtBalances: ProductBalanceInfo[]) {}
}


export type DigitalCdtBalancesActions =
  | GetDigitalCdtBalancesAction
  | GetDigitalCdtBalancesSuccessAction
  | GetDigitalCdtBalancesErrorAction
  | SetDigitalCdtBalancesAction;
