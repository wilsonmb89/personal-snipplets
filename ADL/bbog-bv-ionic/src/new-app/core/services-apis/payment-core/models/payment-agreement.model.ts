export interface PaymentAgreementRq {
  name: string;
}

export interface PaymentAgreementRs {
  inquiriesAgreementDtos: Array<InquiriesAgreementDto>;
}

export interface InquiriesAgreementDto {
  code: string;
  name: string;
  category?: string;
  urlImage: string;
}

export interface CreateBillRq {
  orgIdNum: string;
  nickname: string;
  nie: string;
}


export interface CreateBillRs {
  message: string;
  approvalId: string;
  requestId: string;
}

export interface DeleteInvoiceRq {
  orgIdNum: string;
  invoiceNum: string;
  nie: string;
}
export interface DeleteInvoiceRs {
  message: string;
  approvalId: string;
  requestId: string;
}
