export interface LimitInformationRq {
  acctId: string;
  acctType: string;
  trnCode?: string;
}

export interface LimitInformationRs {
  bankLimit: Array<BankLimit>;
}

export interface BankLimit {
  channel: string;
  desc: string;
  amount: string;
  count: string;
}
