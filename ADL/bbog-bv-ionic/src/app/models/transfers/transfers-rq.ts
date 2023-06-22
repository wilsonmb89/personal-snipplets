import { Customer } from '../bdb-generics/customer';
import { TransferPaymentInfo } from './payment-info';
import { TransferAcctBasicInfoFrom } from './acct-from';
import { TransferAcctBasicInfoTo } from './acct-to';
import { RefInfo } from './ref-info';

export class TransferRq {
    constructor(
        public networkOwner: string,
        public paymentInfo: TransferPaymentInfo,
        public acctBasicInfoFrom: TransferAcctBasicInfoFrom,
        public acctBasicInfoTo: TransferAcctBasicInfoTo,
        public refInfo: RefInfo,
        public idempotencyKey?: string
    ) {}
}
