import { Action } from '@ngrx/store';
import { PaymentObligation } from '../../../../core/services-apis/transfer/transfer-core/models/payment-obligations.model';
import {HttpErrorResponse} from '@angular/common/http';

export const FETCH_AC_OBLIGATIONS = '[Global/API] Fetch get aval credit obligations';
export const FETCH_AVAL_OBLIGATIONS_SUCCESS = '[Global/API] Fetch get aval credit obligations success';
export const FETCH_BOG_OBLIGATIONS_SUCCESS = '[Global/API] Fetch get Bogota credit obligations success';
export const FETCH_AC_OBLIGATIONS_ERROR = '[Global/API] Fetch get credits credit obligations error';
export const FETCH_AC_OBLIGATIONS_SKIP = '[Global/API] Fetch get credits credit obligations skip';
export const REMOVE_AC_OBLIGATIONS = '[Global/API] Remove aval credit obligations';
export const ADD_OBLIGATION = '[Global/API] Add credit obligation';

export class FetchACObligationsAction implements Action {
  readonly type = FETCH_AC_OBLIGATIONS;
}

export class FetchAvalObligationsSuccessAction implements Action {
  readonly type = FETCH_AVAL_OBLIGATIONS_SUCCESS;

  constructor(public avalCreditsObligations: PaymentObligation[]) {
  }
}

export class FetchBogObligationsSuccessAction implements Action {
  readonly type = FETCH_BOG_OBLIGATIONS_SUCCESS;

  constructor(public bogCreditsObligations: PaymentObligation[]) {
  }
}

export class FetchACObligationsErrorAction implements Action {
  readonly type = FETCH_AC_OBLIGATIONS_ERROR;

  constructor(public error: HttpErrorResponse) {
  }
}

export class FetchACObligationsSkipAction implements Action {
  readonly type = FETCH_AC_OBLIGATIONS_SKIP;
}

export class RemoveACObligationsAction implements Action {
  readonly type = REMOVE_AC_OBLIGATIONS;
}

export class AddObligationAction implements Action {
  readonly type = ADD_OBLIGATION;

  constructor(public paymentObligation: PaymentObligation) {
  }
}

export type acObligationsActions =
  FetchACObligationsAction |
  FetchAvalObligationsSuccessAction |
  FetchBogObligationsSuccessAction |
  FetchACObligationsErrorAction |
  RemoveACObligationsAction |
  FetchACObligationsSkipAction |
  AddObligationAction;
