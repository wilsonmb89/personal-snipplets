import { RootState } from '../../../store';
import { Account } from '../../models/account.model';
import { UpdateLimitState } from './update.entity';

export const updateLimitState = (state: RootState): UpdateLimitState => state.updateLimitState;

export const updateAccountLimitSelector = (state: RootState): Account => {
  const { acctId, acctType } = updateLimitState(state);
  return { acctId, acctType };
};
