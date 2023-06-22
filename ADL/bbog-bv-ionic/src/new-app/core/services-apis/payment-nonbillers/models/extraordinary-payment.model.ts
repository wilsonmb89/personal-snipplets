
export interface ExtraordinaryPaymentRq {
  depAcctId: DepAcctId;
}

export interface DepAcctId {
  acctId: string;
  acctType: string;
  subProduct: string;
}

export interface ExtraordinaryPaymentRs {
  status: string;
}
