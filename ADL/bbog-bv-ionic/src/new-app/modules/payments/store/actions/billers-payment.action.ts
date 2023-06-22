import { Action } from '@ngrx/store';
import { BillerInfoList } from '../../../../core/services-apis/payment-core/models/billers-payment.model';

export const FETCH_BILLERS_PAYMENT = '[Global/API] Fetch get billers payment';
export const FETCH_BILLERS_PAYMENT_SUCCESS = '[Global/API] Fetch get billers payment success';
export const FETCH_BILLERS_PAYMENT_ERROR = '[Global/API] Fetch get billers payment error';
export const REMOVE_BILLERS_PAYMENT = '[Global/API] Remove billers payment';

export class FetchBillersPaymentAction implements Action {
    readonly type = FETCH_BILLERS_PAYMENT;
}

export class FetchBillersPaymentSuccessAction implements Action {
    readonly type = FETCH_BILLERS_PAYMENT_SUCCESS;

    constructor(public billerInfoList: BillerInfoList[]) { }
}

export class FetchBillersPaymentErrorAction implements Action {
    readonly type = FETCH_BILLERS_PAYMENT_ERROR;

    constructor(public error: any) { }
}

export class RemoveBillersPaymentAction implements Action {
    readonly type = REMOVE_BILLERS_PAYMENT;
}

export type BillersPaymentActions =
    FetchBillersPaymentAction |
    FetchBillersPaymentSuccessAction |
    RemoveBillersPaymentAction |
    FetchBillersPaymentErrorAction;
