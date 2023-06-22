import { PersonName } from './person-name';
import { CustId } from './cust-id';

export class AcctHolderInfo {
    constructor(
        public typeId: string,
        public participantId: string,
        public personName: PersonName,
        public custId: CustId
    ) {}
}
