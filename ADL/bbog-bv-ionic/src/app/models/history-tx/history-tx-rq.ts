import { Customer } from '../bdb-generics/customer';


export class HistoryTxRq {
    customer: Customer;
    ipAddr: string;
    balance: Balance;
}

export class Balance {
    type: string;
    initDate: string;
    endDate: string;
}
