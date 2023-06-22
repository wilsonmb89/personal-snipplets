export interface GetBillersPaymentRs {
    billerInfoList: BillerInfoList[];
}

export interface BillerInfoList {
    invoiceNum: string;
    nie: string;
    nickname: string;
    contraction: string;
    orgIdNum: string;
    orgInfoName: string;
    agrmType: string;
    pmtType: string;
    maxAmount: string;
    invoiceVouchNum: string;
    hasInvoice: boolean;
    scheduled: boolean;
    amt: string;
    dueDt: string;
    expDt: string;
    accountNumber: string;
    accountType: string;
    toPayBeforeExpDaysThreshold: string;
    invGen: boolean;
}

export interface BillerMngrRequest {
    orgIdNum: string;
    nickname: string;
    nie: string;
}

export interface BillerMngrResponse {
    message: string;
    approvalId: string;
    requestId: string;
}
