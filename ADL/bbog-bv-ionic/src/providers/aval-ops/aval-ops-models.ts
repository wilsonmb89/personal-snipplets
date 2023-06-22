

export class GetBalancesByAccountRs {
    public avalProductInfo: AvalProductInfo;
    public details: Array<any>;
}

export class AvalProductInfo {
    public acctId: string;
    public acctType: string;
    public bankId: string;
}

export class GetBalancesByAccountRq {
    public avalProductInfo: AvalProductInfo;
    public clientIp: string;
}
