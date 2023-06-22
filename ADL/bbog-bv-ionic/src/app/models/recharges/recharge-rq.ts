import { Customer } from '../bdb-generics/customer';
import { BankAccount } from './bank-account';
import { RechargePaymentInfo } from './payment-info';

export class RechargeRq {

    constructor(
        public account: BankAccount,
        public paymentInfo: RechargePaymentInfo
    ) {}
}
