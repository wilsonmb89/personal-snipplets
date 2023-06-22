export interface AccountReference {
  acctId: string;
  acctType: string;
  amount: any;
  openDt: string;
  includedAmt: boolean;
}

export interface CustomerReference {
  fullName: string;
  email?: string;
}

export interface BankReferenceRq {
  accountReference: Array<AccountReference>;
  receiver: string;
  customerReference: CustomerReference;
}
