import * as fromBillersPaymentActions from '../actions/billers-payment.action';
import { BillersPaymentState } from '../states/payment-core.state';

export const initialState: BillersPaymentState = {
    billerInfoList: [],
    working: false,
    completed: false,
    error: null
};

export function billerInfoListReducer(
    state = initialState,
    action: fromBillersPaymentActions.BillersPaymentActions
): BillersPaymentState {
    switch (action.type) {
        case fromBillersPaymentActions.FETCH_BILLERS_PAYMENT:
            return {
                ...state,
                working: true,
                error: null
            };
        case fromBillersPaymentActions.FETCH_BILLERS_PAYMENT_SUCCESS:
            return {
                ...state,
                billerInfoList: action.billerInfoList,
                working: false,
                completed: true,
                error: null
            };
        case fromBillersPaymentActions.REMOVE_BILLERS_PAYMENT:
            return {
                ...state,
                billerInfoList: [],
                working: false,
                completed: false,
                error: null
            };
        case fromBillersPaymentActions.FETCH_BILLERS_PAYMENT_ERROR:
            if (
                action.error.status === 409 &&
                !!action.error.error &&
                !!action.error.error.businessErrorCode &&
                action.error.error.businessErrorCode === '1'
            ) {
                return {
                    ...state,
                    billerInfoList: [],
                    working: false,
                    completed: true,
                    error: null
                };
            }
            return {
                ...state,
                error: action.error,
                billerInfoList: [],
                working: false,
                completed: false
            };
        default:
            return state;
    }
}
