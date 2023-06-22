export interface BalanceRequestProperty {
  acctId: string;
  acctType: string;
  bankId: string;
  officeId: string;
  acctSubType: string;
}

export interface BalanceRequest {
  productsInfo: BalanceRequestProperty[];
}

interface FeeDetails {
  Normal: string;
  Late: string;
}
export interface ProductBalanceInfo {
  accountId?: string;
  accountType?: string;
  status?: string;
  expDate?: string;
  balanceDetail?: Balance;
  canRecId?: string;
  name?: string;
  loanName?: string;
  nextPmtCurAmt?: string;
  dueDt?: string;
  openDt?: string;
  upDt?: string;
  feeDetails?: FeeDetails;
  overdraftDays?: string;
  minPmtCurAmt?: string;
}

export interface Balance {
  Current?: string;
  PendAuthAmt?: string;
  Avail?: string;
  TotLoaAmt?: string;
  Principal?: string;
  NextAmtFee?: string;
  TotalHeld?: string;
  CashLimit?: string;
  CashAvail?: string;
  PayoffAmt?: string;
  AvailCredit?: string;
  CreditLimit?: string;
  Orig?: string;
}
export interface BalancesResponse {
  accountId: string;
  accountType: string;
  balanceDetail: Balance;
  status: string;
  expDate: string;
  minPmtCurAmt?: string;
}

export interface BalancesState {
  isConsumed: boolean;
  error: Error | null;
}

export const initialState: BalancesState = {
  isConsumed: false,
  error: null
};
