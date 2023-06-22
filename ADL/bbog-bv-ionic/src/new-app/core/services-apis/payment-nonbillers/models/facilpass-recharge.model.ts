export interface FacipassRechargeRq {
  amount: string;
  codeNIE: string;
  account: FacilpassAccount;
  trxForce: boolean;
}

export interface FacilpassAccount {
  accountNumber: string;
  accountType: string;
  accountName?: string;
}

export interface FacipassRechargeRs {
  message: string;
  approvalId: string;
  requestId: string;
}
