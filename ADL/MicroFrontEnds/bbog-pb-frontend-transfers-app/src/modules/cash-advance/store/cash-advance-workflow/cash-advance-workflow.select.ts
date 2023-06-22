import { RootState } from '@store/index';
import { CashAdvanceWorkflowData } from './cash-advance-workflow.entity';

export const cashAdvanceWorkflowSelector = (state: RootState): CashAdvanceWorkflowData =>
  state.cashAdvanceWorkflowState;
