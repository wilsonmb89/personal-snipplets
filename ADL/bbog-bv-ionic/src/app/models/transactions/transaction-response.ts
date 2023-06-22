import { TransactionsDate } from './transactions-date';
import { ErrorDTO } from '../error';

export class TransactionRs {

    constructor(public error: ErrorDTO, public transactionsDate: TransactionsDate[]) {}
}
