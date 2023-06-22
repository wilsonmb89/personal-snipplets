import { Customer } from '../bdb-generics/customer';

export class CardInfoRq {
    public cardNumber: string;
    public cardSeq: string;
    public cardType: string;
    public expDate: any;
    public cardVerifyData: string;
}

export class ActivateDebitRq {
    public customer: Customer;
    public cardInfo: CardInfoRq;
    public clientIp: string;
    public otp: string;
}
