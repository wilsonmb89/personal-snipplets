export class BillInfo {

    constructor(
        public invoiceNum: string,
        public nie: string,
        public nickname: string,
        public orgIdNum: string,
        public orgInfoName: string,
        public isInvGen: boolean,
        public contraction: string,
        public invoiceVouchNum: string,
        public agrmType: string,
        public hasInvoice: boolean,
        public scheduled: boolean,
        public pmtType: string,
        public amt?: string,
        public dueDt?: string | Date | number,
        public expDt?: string | Date | number,
        public account?: any,
        public maxAmount?: string,
        public daysBefAft?: string
    ) { }
}
