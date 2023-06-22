import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LimitsItem, LimitsState } from '@app/modules/settings/store/states/limits.state';

export const getLimitsState = createFeatureSelector<LimitsState>('limitsState');


export const getLimits = createSelector(
  getLimitsState, (state: LimitsState): LimitsItem[] => state.limitsItems
  );
