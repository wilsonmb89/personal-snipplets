export interface ProductsInquiriesRq {
    bankId: string;
}

export interface PartyAcctRelRec {
    acctName: string;
    acctId: string;
    acctType: string;
    balanceDetail: { [key: string]: string };
}

export interface ProductsInquiriesResponse {
    partyAcctRelRec: PartyAcctRelRec[];
}
