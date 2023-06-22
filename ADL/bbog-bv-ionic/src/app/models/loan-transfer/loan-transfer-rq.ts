import { Customer } from '../bdb-generics/customer';
import { TransferPaymentInfo } from '../transfers/payment-info';
import { TransferAcctBasicInfoFrom } from '../transfers/acct-from';
import { TransferAcctBasicInfoTo } from '../transfers/acct-to';
import { RefInfo } from '../transfers/ref-info';

export class LoanTransferRq {
    public networkOwner: string;
    public paymentInfo: TransferPaymentInfo;
    public acctBasicInfoFrom: TransferAcctBasicInfoFrom;
    public acctBasicInfoTo: TransferAcctBasicInfoTo;
    public refInfo: RefInfo;
}
