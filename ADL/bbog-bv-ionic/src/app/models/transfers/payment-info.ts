export class TransferPaymentInfo {
    constructor(
        public refType: string,
        public billId: string,
        public pmtConcept: string,
        public value: string
    ) {}
}
