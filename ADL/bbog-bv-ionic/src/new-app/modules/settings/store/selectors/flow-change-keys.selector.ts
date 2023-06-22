import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsFlowsState } from '../states/flow-settings.state';

export const settingsFlowsState = createFeatureSelector<SettingsFlowsState>('settingsFlowsState');

export const getDebitCardFlowPass = createSelector(
    settingsFlowsState,
    (state: SettingsFlowsState) => state.debitCardFlowPass
);

export const getCreditCardFlowPass = createSelector(
    settingsFlowsState,
    (state: SettingsFlowsState) => state.creditCardFlowPass
);
