export class TuPlusRs {
    error: any;
    totalPoints: string;
    partners: TuPlusPartners[];
}

export interface TuPlusPartners {
    name: string;
    points: string;
}

export interface TuPlusTransaction {
    error: any;
    transactions: TuPlusDetail[];
}

export interface TuPlusDetail {
    bank: string;
    date: string;
    establishment: string;
    accumulatedPoints: string;
    amount: string;
    product: string;
    expDt: string;
    transactionType: string;
}


export class FilterDateParams {
    startDate: string;
    endDate: string;
}
