export interface LimitUpdateRq {
  acctId: string;
  acctType: string;
  limits: Array<BankLimit>;
}

export interface BankLimit {
  channel: string;
  amount: string;
  count: string;
}

export interface LimitUpdateRs {
  message: string;
  approvalId: string;
  requestId: string;
}
