export interface GetStatementPeriodRq {
    acctId: string;
    acctType: string;
}

export interface ListRangeDto {
    name: string;
    value: string;
}

export interface GetStatementPeriodRs {
    rangeDt: ListRangeDto[];
}
