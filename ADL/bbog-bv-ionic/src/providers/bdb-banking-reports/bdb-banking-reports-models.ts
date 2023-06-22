export class AccountReferenceRq {
  accountReference: AccountReference[];
  receiver: string;
  customerReference: CustomerReference;
}

export class AccountReference {
  acctId: string;
  acctType: string;
  amount: number;
  openDt: string;
  includedAmt: boolean;
}

export class CustomerReference {
  fullName: string;
  email: string;
}

export interface AccountReferenceRs {
  binData: string;
  fileName: string;
}

