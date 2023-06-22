import { NewAuthenticatorResponse } from '@app/apis/authenticator/models/authenticator.model';

export type EventTypes =
  | 'NAVIGATION'
  | 'LOGIN'
  | 'LOGOUT'
  | 'START'
  | 'TOP_NAVIGATION';

export type sessionStorageTypes =
  | UpdateLimitState
  | TargetAccountState
  | NewAuthenticatorResponse
  | ProductsState[]
  | CashAdvanceWorkflowState;

export type sessionStorageKeys =
  | 'UpdateLimitState'
  | 'TargetAccountState'
  | 'AuthState'
  | 'ProductsState'
  | 'CashAdvanceWorkflowState';

export interface UpdateLimitState {
  acctId: string;
  acctType: string;
}

export interface TargetAccountState {
  accountAlias: string;
  accountType: string;
  accountId: string;
  bankId: string;
  bankName: string;
  isAval: boolean;
}

interface BalanceDetail {
  Current?: string;
  PendAuthAmt?: string;
  Avail?: string;
  TotLoaAmt?: string;
  Principal?: string;
  TotalHeld?: string;
  CashLimit?: string;
  CashAvail?: string;
  PayoffAmt?: string;
  AvailCredit?: string;
  CreditLimit?: string;
  Orig?: string;
}

export interface ProductBalanceInfo {
  accountId?: string;
  accountType?: string;
  status?: string;
  expDate?: string;
  balanceDetail?: BalanceDetail;
  canRecId?: string;
  name?: string;
  loanName?: string;
  nextPmtCurAmt?: string;
  dueDt?: string;
  openDt?: string;
  upDt?: string;
  overdraftDays?: string;
  minPmtCurAmt?: string;
}

export interface ProductsState {
  productNumber: string;
  balanceInfo?: ProductBalanceInfo;
  productName: string;
  description: string;
  officeId: string;
  productAthType: string;
  productBankType: string;
  productBankSubType: string;
  valid: boolean;
  franchise: string;
  openDate: string;
  status?: string;
}

export interface CashAdvanceWorkflowState {
  step: number;
  cardSelected: ProductsState;
  directAccess: boolean;
}
