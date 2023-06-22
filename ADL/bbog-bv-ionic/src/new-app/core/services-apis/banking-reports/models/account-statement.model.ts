export interface BankStatementRequest {
    startDate: string;
    docFormat: string;
    acctId: string;
    acctType: string;
}

export interface GetAccountStatementRs {
    statusDesc: string;
    binData: string;
}
