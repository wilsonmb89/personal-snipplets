export interface TransactionsInquiryRequest {
    startDate: string;
    endDate: string;
}

export interface LoyaltyTransaction {
    transactionType: string;
    status: string;
    date: string;
    expDate: string;
    totalPoints: string;
    description: string;
    partner: string;
    amount: string;
    product: string;
    establishment: string;
}

export interface TransactionsInquiryResponse {
    loyaltyTransactions: LoyaltyTransaction[];
}
