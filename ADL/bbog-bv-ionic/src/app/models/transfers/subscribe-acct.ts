import { BankInfo } from '../bank-info';
import { AcctHolderInfo } from './acct-holder-info';
import { EnrollHolderInfo } from './enroll-holder-info';

export class EnrollProduct {

    public productId: string;
    public acctType: string;
    public acctSubType: string;
    public bankInfo: BankInfo;
    public acctHolderInfo: EnrollHolderInfo;
    public acctName: string;

}
