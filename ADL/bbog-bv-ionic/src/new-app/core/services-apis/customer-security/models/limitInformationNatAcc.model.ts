export interface LimitInformationNatAccRq {
  acctId: string;
  acctType: string;
}

export interface LimitInformationNatAccRs {
  bankLimit: Array<BankLimitNatAcc>;
}

export interface BankLimitNatAcc {
  amount: string;
  trnCode: string;
  typeField: string;
}
