import { AccountLimit } from '../../models/account-limit.model';
import { Limit } from '../../models/limit.model';

export interface UpdateAccountLimitRequest {
  acctId: string | null;
  acctType: string | null;
  limit: AccountLimit | null;
}

export interface TransactionSuccessResponse {
  message: string;
  approvalId: string;
  requestId: string;
}
export interface UpdateLimitState {
  acctId: string | null;
  acctType: string | null;
  limit: Omit<Limit, 'desc'>;
}

export const initialState: UpdateLimitState = {
  acctId: null,
  acctType: null,
  limit: {
    channel: null,
    amount: null
  }
};
