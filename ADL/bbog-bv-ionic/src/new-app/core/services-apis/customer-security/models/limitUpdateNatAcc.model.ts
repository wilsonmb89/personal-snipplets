export interface LimitUpdateNatAccRq {
  acctId: string;
  acctType: string;
  limits: Array<BankLimitNatAcc>;
}

export interface BankLimitNatAcc {
  amount: string;
  trnCode: string;
  typeField: string;
}

export interface LimitUpdateNatAccRs {
  message: string;
  approvalId: string;
  requestId: string;
}
