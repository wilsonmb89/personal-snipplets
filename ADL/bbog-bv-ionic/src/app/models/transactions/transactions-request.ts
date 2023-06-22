import { Customer } from '../bdb-generics/customer';
import { Account } from '../fiducia/account';

export class TransactionRq {

    constructor(
        public customer: Customer,
        public account: Account,
        public startDate: string,
        public endDate: string
    ) {}
}
