import * as cardsInfoActions from '../actions/cards-info.action';
import { CardsInfoState } from '../states/cards-info.state';

export const initialState: CardsInfoState = {
  customerCardList: [],
  working: false,
  completed: false,
  error: null
};

export function accountListListReducer(
  state = initialState,
  action: cardsInfoActions.CardsInfoActions
): CardsInfoState {
  switch (action.type) {
    case cardsInfoActions.FETCH_CARDS_INFO:
      return {
        ...state,
        working: true
      };
    case cardsInfoActions.REFRESH_CARDS_INFO:
      return {
        ...state,
        completed: false
      };
    case cardsInfoActions.FETCH_CARDS_INFO_SUCCESS:
      return {
        ...state,
        customerCardList: action.customerCardList,
        working: false,
        completed: true,
        error: null
      };
    case cardsInfoActions.FETCH_CARDS_INFO_ERROR:
      return {
        ...state,
        customerCardList: [],
        error: action.error,
        working: false,
        completed: false
      };
    case cardsInfoActions.REMOVE_CARDS_INFO:
      return {
        ...state,
        customerCardList: null,
        error: null,
        working: false,
        completed: false
      };
    default:
      return state;
  }
}
