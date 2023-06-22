import { Customer } from '../bdb-generics/customer';

export class CardCardsSecurtiyRq {
    public cardNumber: string;
    public cardType: string;
}

export class CardsSecurtiyRq {
    public customer: Customer;
    public card: CardCardsSecurtiyRq;
    public fallBack: string;
}
