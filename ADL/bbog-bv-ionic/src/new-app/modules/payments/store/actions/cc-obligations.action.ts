import { Action } from '@ngrx/store';
import { PaymentObligation } from '../../../../core/services-apis/transfer/transfer-core/models/payment-obligations.model';

export const FETCH_CC_OBLIGATIONS = '[Global/API] Fetch get credit card obligations';
export const FETCH_CC_OBLIGATIONS_SUCCESS = '[Global/API] Fetch get credit card obligations success';
export const FETCH_CC_OBLIGATIONS_ERROR = '[Global/API] Fetch get credit card obligations error';
export const REMOVE_CC_OBLIGATIONS = '[Global/API] Remove credit card obligations';

export class FetchCCObligationsAction implements Action {
    readonly type = FETCH_CC_OBLIGATIONS;
}

export class FetchCCObligationsSuccessAction implements Action {
    readonly type = FETCH_CC_OBLIGATIONS_SUCCESS;

    constructor(public paymentObligations: PaymentObligation[]) { }
}

export class FetchCCObligationsErrorAction implements Action {
    readonly type = FETCH_CC_OBLIGATIONS_ERROR;

    constructor(public error: any) { }
}

export class RemoveCCObligationsAction implements Action {
    readonly type = REMOVE_CC_OBLIGATIONS;
}

export type CCObligationsActions =
    FetchCCObligationsAction |
    FetchCCObligationsSuccessAction |
    RemoveCCObligationsAction |
    FetchCCObligationsErrorAction;
