import * as fromCCObligationsActions from '../actions/cc-obligations.action';
import { CCObligationsState } from '../states/cc-obligations.state';

export const initialState: CCObligationsState = {
    paymentObligations: [],
    working: false,
    completed: false,
    error: null
};

export function ccObligationsReducer(
    state = initialState,
    action: fromCCObligationsActions.CCObligationsActions
): CCObligationsState {
    switch (action.type) {
        case fromCCObligationsActions.FETCH_CC_OBLIGATIONS:
            return {
                ...state,
                working: true,
                error: null
            };
        case fromCCObligationsActions.FETCH_CC_OBLIGATIONS_SUCCESS:
            return {
                ...state,
                paymentObligations: action.paymentObligations,
                working: false,
                completed: true,
                error: null
            };
        case fromCCObligationsActions.REMOVE_CC_OBLIGATIONS:
            return {
                ...state,
                paymentObligations: [],
                working: false,
                completed: false,
                error: null
            };
        case fromCCObligationsActions.FETCH_CC_OBLIGATIONS_ERROR:
            return {
                ...state,
                error: action.error,
                paymentObligations: [],
                working: false,
                completed: false
            };
        default:
            return state;
    }
}
