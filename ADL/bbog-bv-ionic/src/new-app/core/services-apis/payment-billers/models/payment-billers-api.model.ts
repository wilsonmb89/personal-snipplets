export class PayBillRq {
  public amount: number;
  public codeService: string;
  public invoiceNum?: string;
  public codeNIE: string;
  public expDate?: string;
  public account: Account;
}

export interface PayBillRs {
  message: string;
  approvalId: string;
  requestId: string;
}

export type PmtCodServ = 'Tributary' | 'Customs';

export class CheckPaymentTaxRq {
  public pmtCodServ: PmtCodServ;
  public govIssueIdentType?: string;
  public identSerialNum?: string;
  public invoiceNum?: string;
}

export interface CheckPaymentTaxRs {
  invoiceInfoDetails: Array<InvoiceInfoDetail>;
}

export interface InvoiceInfoDetail {
  desc: string;
  invoiceNum: string;
  totalCurAmt: string;
  feeAmt: string;
  pmtPeriod: string;
  taxType: string;
  invoiceType: string;
  paidCurAmt: string;
  expDt: string;
  dueDt: string;
  billStatus: string;
  identSerialNum: string;
  govIssueIdentType: string;
}

export class TaxPayRq {
  public account: Account;
  public invoiceType: string;
  public invoiceNum: string;
  public govIssueIdentType: string;
  public identSerialNum: string;
  public totalCurAmt: string;
  public feeAmt: string;
  public expDt: string;
  public taxInfoAmt: string;
  public taxType: string;
  public taxTypeInvoice: string;
  public pmtPeriod: string;
}

export class Account {
  public accountNumber: string;
  public accountType: string;
}

export interface PaymentRs {
  message: string;
  approvalId: string;
  requestId: string;
}

export interface GetDistrictTaxRq {
  billNum: string;
  orgId: string;
}

export interface GetDistrictTaxRs {
  amount: number;
  codeService: string;
  orgInfoName: string;
  referenceList: any[];
  invoiceNum: string;
  codeNIE: string;
  expirationDate: string;
  contraction: string;
}

export interface PayDistrictTaxRq {
  account: {
    accountNumber: string;
    accountType: string;
  };
  amount: string;
  codeService: string;
  taxFormNum: string;
}

export interface PayDistrictTaxRs {
  message: string;
}

export interface DistrictTaxCity {
  cityId: string;
  city: string;
}

export interface DistrictTaxAgreement {
  taxId: string;
  taxName: string;
}

export interface PaymentPilaRq {
  amount: number;
  account: Account;
  formNumber: string;
  paymentCode: string;
  period: string;
  formHolderId: string;
}

export interface GetBillRq {
  billNum: string;
  orgId: string;
  includePaymentCustomInfo?: boolean;
}

export interface GetBillRs {
  bills: Array<BillInfo>;
}

export interface BillInfo {
  amount: number;
  codeService?: string;
  orgInfoName?: string;
  customPaymentInfo?: CustomPaymentInfo;
  invoiceNum: string;
  codeNIE: string;
  expDate?: string;
}

export interface CustomPaymentInfo {
  INF?: string;
  NIE?: string;
}


