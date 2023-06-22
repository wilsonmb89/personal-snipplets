export interface DonationRq {
    acctId: string;
    acctType: string;
    enterpriseId: string;
    amount: number;
}

export interface DonationRs {
    message: string;
    approvalId: string;
    requestId: string;
}
