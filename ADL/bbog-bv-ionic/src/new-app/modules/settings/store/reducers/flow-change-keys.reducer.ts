
import * as fromflowChangeKeysActions from '../actions/flow-change-keys.action';
import { SettingsFlowsState } from '../states/flow-settings.state';

export const initialState: SettingsFlowsState = {
    debitCardFlowPass: null,
    creditCardFlowPass: null
};

export function flowChangeKeysReducer(
    state = initialState,
    action: fromflowChangeKeysActions.FlowChangeKeysActions
): SettingsFlowsState {
    switch (action.type) {
        case fromflowChangeKeysActions.SET_DEBIT_CARD_FLOW:
            return {
                ...state,
                debitCardFlowPass: action.debitCard
            };
        case fromflowChangeKeysActions.FLOW_CHANGE_KEYS_RESET:
            return {
                ...state,
                debitCardFlowPass: null,
                creditCardFlowPass: null,
            };
        case fromflowChangeKeysActions.SET_CREDIT_CARD_FLOW:
            return {
                ...state,
                creditCardFlowPass: action.creditCard
            };
        default:
            return state;
    }
}
