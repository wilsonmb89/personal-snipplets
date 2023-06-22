import { CustId } from './cust-id';

export class EnrollHolderInfo {
    constructor(
        public typeId: string,
        public participantId: string,
        public personName: string,
        public custId: CustId
    ) {}
}
