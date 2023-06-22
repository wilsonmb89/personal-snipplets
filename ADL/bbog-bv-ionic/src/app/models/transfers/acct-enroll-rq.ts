import { Customer } from '../bdb-generics/customer';
import { AcctHolderInfo } from './acct-holder-info';
import { EnrollProduct } from './subscribe-acct';

export class AcctEnrollRq {
    public customer: Customer;
    public acctInfo: EnrollProduct;
    public operationType: string;
}
