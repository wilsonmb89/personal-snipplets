import { LimitsState } from '@app/modules/settings/store/states/limits.state';
import * as limitsActions from '@app/modules/settings/store/actions/limits.actions';

const initialState: LimitsState = {
  limitsItems: [],
  completed: false,
  working: false,
  error: null
};

export function LimitsReducer(
  state: LimitsState = initialState,
  action: limitsActions.LimitActions
) {
  switch (action.type) {

    case limitsActions.FETCH_ALL_LIMITS:
      return {
        ...state,
        working: true,
        completed: false
      };

    case limitsActions.FETCH_LIMITS_ALL_COMPLETED:
      return {
        ...state,
        working: false,
        completed: true,
        limitsItems: action.limits
      };
    case limitsActions.RELOAD_LIMIT:
      return {
        ...state,
        working: true,
        completed: false,
      };
    case limitsActions.RELOAD_LIMIT_COMPLETED:
      return {
        ...state,
        working: false,
        completed: true,
        limitsItems: action.limits
      };
    case limitsActions.REMOVE_LIMITS:
      return {
        ...state,
        working: false,
        completed: false,
        limitsItems: [],
        error: null
      };
    default:
      return state;
  }

}
