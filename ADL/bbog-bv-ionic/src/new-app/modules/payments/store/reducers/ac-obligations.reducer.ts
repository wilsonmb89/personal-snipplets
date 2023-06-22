import { AcObligationsState } from '../states/ac-obligations.state';
import * as fromACObligationsActions from '../actions/ac-obligations.action';

export const initialState: AcObligationsState = {
  creditObligations: [],
  working: false,
  error: null,
  isAvalCreditsCompleted: false,
  isBogCreditsCompleted: false
};


export function acObligationsReducer(
  state: AcObligationsState = initialState,
  action: fromACObligationsActions.acObligationsActions
): AcObligationsState {

  switch (action.type) {
    case fromACObligationsActions.FETCH_AC_OBLIGATIONS:
      return {
        ...state,
        working: true,
        error: null
      };

    case fromACObligationsActions.FETCH_AVAL_OBLIGATIONS_SUCCESS:
      return {
        ...state,
        working: false,
        error: null,
        creditObligations: [...state.creditObligations, ...action.avalCreditsObligations],
        isAvalCreditsCompleted: true
      };

    case fromACObligationsActions.FETCH_BOG_OBLIGATIONS_SUCCESS:
      return {
        ...state,
        working: false,
        error: null,
        creditObligations: [...state.creditObligations, ...action.bogCreditsObligations],
        isBogCreditsCompleted: true
      };

    case fromACObligationsActions.FETCH_AC_OBLIGATIONS_ERROR:
      return {
        ...state,
        error: action.error,
        working: false,
      };

    case fromACObligationsActions.FETCH_AC_OBLIGATIONS_SKIP:
      return {
        ...state,
        working: false,
      };

    case fromACObligationsActions.REMOVE_AC_OBLIGATIONS:
      return {
        ...state,
        creditObligations: [],
        working: false,
        error: null,
        isBogCreditsCompleted: false,
        isAvalCreditsCompleted: false
      };

    case fromACObligationsActions.ADD_OBLIGATION:
      return {
        ...state,
        creditObligations: [...state.creditObligations, action.paymentObligation],
      };

    default:
      return state;

  }

}
