export interface PaymentObligation {
    productBank: string;
    bankId: string;
    aval: boolean;
    productAlias: string;
    productName: string;
    productType: string;
    productNumber: string;
    franchise: string;
}

export interface GetPaymentObligationsRs {
    paymentObligations: PaymentObligation[];
}
