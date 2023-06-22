export class CustomerCard {
    public cardNumber: string;
    public cardType: string;
    public expDate: string;
    public cardVerifyData: string;
    public cardState: string;
    public displayNumber: string;
    public lastDigits: string;
    public nameCard?: string;
    public description?: string;
    public logoPath?: string;
    public lockId?: string;
}

export interface CustomerInfo {
    name: string;
    mainMail: string;
    auxMail: string;
    saved: boolean;
}

export class CustomerCardsListRs {
    public customerInfo: CustomerInfo;
    public customerCardsList: Array<CustomerCard>;
}
