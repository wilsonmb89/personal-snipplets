import { RootState } from '..';

import { BalancesState } from './balances.entity';

export const balanceState = (state: RootState): BalancesState => state.balanceState;

export const isConsumed = (state: RootState): boolean => balanceState(state).isConsumed;
