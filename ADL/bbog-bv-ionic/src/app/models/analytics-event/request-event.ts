import { BdbTransactionsCode } from '../../../app/models/analytics-event/bdb-transactions-code';


export class RequestEvents {

    public transactionsCode: BdbTransactionsCode;
    public aditionalInfo: Object[];

    constructor(
        transaction: BdbTransactionsCode,
        aditionalInfo: Object[] = []
    ) {
     this.transactionsCode = transaction;
     this.aditionalInfo = aditionalInfo;
    }

 }
