import { Customer } from '../../../app/models/bdb-generics/customer';
import { AccountLimitsRq } from './get-accounts-limits-request';

export class LimitsRq {

    public networkOwner: string;
    public amount: string;
    public trnCount: string;
    public desc?: string;

    constructor() { }
}

export class AccountsLimitsUpdateRq {

    public customer: Customer;
    public account: AccountLimitsRq;
    public limits?: Array<LimitsRq>;
    public amount?: string;

    constructor() { }
}
