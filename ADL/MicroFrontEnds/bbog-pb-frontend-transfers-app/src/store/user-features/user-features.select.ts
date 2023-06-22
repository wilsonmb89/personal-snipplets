import { RootState } from '..';

import { Customer, UserFeatures } from './user-features.entity';

export const userFeaturesSelector = (state: RootState): UserFeatures => state.userFeaturesState;
export const customerSelector = (state: RootState): Customer => state.userFeaturesState.customer;
