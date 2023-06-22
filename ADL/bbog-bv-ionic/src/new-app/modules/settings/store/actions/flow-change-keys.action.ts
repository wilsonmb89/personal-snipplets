import { Action } from '@ngrx/store';
import { CustomerCard } from '../../../../../app/models/activation-cards/customer-cards-list-rs';

export const SET_DEBIT_CARD_FLOW = '[Global/API] Set debit card flow change password';

export class SetDebitCardAction implements Action {
    readonly type = SET_DEBIT_CARD_FLOW;

    constructor(public debitCard: CustomerCard) { }
}

export const SET_CREDIT_CARD_FLOW = '[Global/API] Set credit card flow change password';

export class SetCreditCardAction implements Action {
    readonly type = SET_CREDIT_CARD_FLOW;

    constructor(public creditCard: CustomerCard) { }
}

export const FLOW_CHANGE_KEYS_RESET = '[Global/API] Reset flows change password';

export class FlowChangeKeysResetAction implements Action {
    readonly type = FLOW_CHANGE_KEYS_RESET;
}

export type FlowChangeKeysActions =
    SetDebitCardAction |
    SetCreditCardAction |
    FlowChangeKeysResetAction;
