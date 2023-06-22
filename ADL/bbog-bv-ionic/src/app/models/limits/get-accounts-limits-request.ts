import { Customer } from '../../../app/models/bdb-generics/customer';

export class AccountLimitsRq {

    public accountNumber: string;
    public accountType: string;
    public accountSubType: string;

    constructor() { }
}

export class GetAccountsLimitsRq {

    public customer: Customer;
    public account: AccountLimitsRq;

    constructor() { }
}
