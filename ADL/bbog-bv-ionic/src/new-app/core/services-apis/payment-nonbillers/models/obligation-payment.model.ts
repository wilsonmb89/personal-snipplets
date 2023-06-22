export interface ObligationPaymentRq {
  paymentType: string;
  paymentInfo: PaymentInfo;
  acctBasicInfoFrom: AcctBasicInfo;
  acctBasicInfoTo: AcctBasicInfo;
  forceTrx?: boolean;
}

export interface PaymentInfo {
  refType: string;
  description: string;
  value: number;
}

export interface AcctBasicInfo {
  acctId: string;
  acctType: string;
  acctSubType: string;
  acctCur: string;
  bankInfo: NewBankInfo;
}

export interface NewBankInfo {
  bankId: string;
  branchId: string;
  refInfo?: Array<RefInfo>;
}

export class RefInfo {
  private refType = '' ;
  private refId = '';
}

export interface ObligationPaymentRs {
  message: string;
  approvalId: string;
}


