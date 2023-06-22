import { ActionLogoutTypes } from '../actions/clear-state.action';
import { Action, ActionReducer } from '@ngrx/store';

export function clearStateMetaReducer<S, A extends Action = Action>() {
    return function (reducer: ActionReducer<S, A>) {
        return function (state: S, action: A): S {
            if (action.type === ActionLogoutTypes.LOGOUT) {
                state = undefined;
            }
            return reducer(state, action);
        };
    };
}
