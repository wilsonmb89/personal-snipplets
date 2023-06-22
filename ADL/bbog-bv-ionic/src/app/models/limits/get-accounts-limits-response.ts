export class LimitsRs {

    public networkOwner: string;
    public desc: string;
    public amount: string;
    public trnCount: string;
    public edit?: boolean;

    constructor() { }
}

export class GetAccountsLimitsRs {

    public error: string;
    public limits: Array<LimitsRs>;

    constructor() { }
}
