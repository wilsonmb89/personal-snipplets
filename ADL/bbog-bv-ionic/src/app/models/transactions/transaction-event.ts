import { TransactionsDate } from './transactions-date';

export class TransactionEvent {

    constructor(
        public acctType: string,
        public transactionsDate: Array<TransactionsDate>) {
    }

}
