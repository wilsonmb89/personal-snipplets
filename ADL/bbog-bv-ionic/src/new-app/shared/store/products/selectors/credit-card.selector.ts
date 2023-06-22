import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CreditCardState } from '../states/credit-card.state';

export const creditCardState = createFeatureSelector<CreditCardState>('creditCardState');

export const getCreditCardActivationCompleted = createSelector(
  creditCardState,
  (state: CreditCardState) => state.activationSuccess
);

export const getCreditCardActivationError = createSelector(
  creditCardState,
  (state: CreditCardState) => state.activationError
);
