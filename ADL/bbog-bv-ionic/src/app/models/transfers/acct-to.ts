import { BankInfo } from '../bank-info';
import { AcctHolderInfo } from './acct-holder-info';

export class TransferAcctBasicInfoTo {

    constructor(
        public productId?: string,
        public acctType?: string,
        public acctSubType?: string,
        public bankInfo?: BankInfo,
        public acctHolderInfo?: AcctHolderInfo[],
        public acctName?: string
    ) {}
}
