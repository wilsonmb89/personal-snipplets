export class CardSecurity {
    public cardNumber: string;
    public cardState: string;
    public cardType: string;
    public displayNumber: string;
    public franchise: string;
    public nameCard?: string;
    public logoPath?: string;
    public active?: boolean;
}

export class CardSecurityListRs {
    public cards: Array<CardSecurity>;
}
