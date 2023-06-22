import { Transaction } from './transactions-model';

export class TransactionsDate {

    constructor(
        public date: string,
        public transactions: Array<Transaction>) {
    }

}

export interface TransactionsResponse {
    error: any;
    transactionsDate: TransactionsDate;
}
