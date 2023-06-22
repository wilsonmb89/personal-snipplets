import { initialState, CreditCardState } from '../states/credit-card.state';
import * as creditCardActions from '../actions/credit-card.action';

export function creditCardReducer(
  state = initialState,
  action: creditCardActions.CreditCardActions
): CreditCardState {
  switch (action.type) {
    case creditCardActions.CARD_ACCOUNT_INFO_SUCCESS:
      return {
        ...state,
        accountInfoSuccess: action.creditCardAccountInfoRs
      };
    case creditCardActions.CARD_ACCOUNT_INFO_ERROR:
      return {
        ...state,
        accountInfoError: action.errorResponse
      };
    case creditCardActions.CARD_ACTIVATION_SUCCESS:
      return {
        ...state,
        activationSuccess: action.creditCardActivationRs
      };
    case creditCardActions.CARD_ACTIVATION_ERROR:
      return {
        ...state,
        activationError: action.errorResponse
      };
    case creditCardActions.CARD_BLOCKING_SUCCESS:
      return {
        ...state,
        blockSuccess: action.creditCardBlockRs
      };
    case creditCardActions.CARD_BLOCKING_ERROR:
      return {
        ...state,
        blockError: action.errorResponse
      };
    case creditCardActions.CARD_UNBLOCK_SUCCESS:
      return {
        ...state,
        unblockSuccess: action.creditCardUnblockRs
      };
    case creditCardActions.CARD_UNBLOCK_ERROR:
      return {
        ...state,
        unblockError: action.errorResponse
      };
    case creditCardActions.CARDS_TO_ACTIVATE_HIDDEN:
      return {
        ...state,
        creditCardsBannerHidden: false
      };
    case creditCardActions.CARDS_TO_ACTIVATE_SHOW:
      return {
        ...state,
        creditCardsBannerHidden: true
      };
    case creditCardActions.TOOLTIP_KEY_HIDDEN:
      return {
        ...state,
        remeberTooltipKey: false
      };
    case creditCardActions.TOOLTIP_KEY_SHOW:
      return {
        ...state,
        remeberTooltipKey: true
      };
    case creditCardActions.CREDIT_CARD_RESET:
      return {
        ...state,
        accountInfoSuccess: null,
        accountInfoError: null,
        activationSuccess: null,
        activationError: null,
        blockSuccess: null,
        blockError: null,
        unblockSuccess: null,
        unblockError: null
      };
    default:
      return state;
  }
}
