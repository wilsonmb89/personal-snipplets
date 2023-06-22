import { RootState } from '../../../../store';
import { TargetAccountState } from './target-account.entity';

export const targetAccountSelector = (state: RootState): TargetAccountState => state.targetAccountState;
