export class VoucherButton {
    id: string;
    name: string;
    func?: any;
    type?: string;
    color?: string;
}

export class VoucherText {
    type?: string;
    img?: string;
    value: string;
    cssClass?: string;
}

export class VoucherDetail {
    name: string;
    text: Array<VoucherText>;
}

export class VoucherInfo {
    number: string;
    date: string;
    content: Array<VoucherDetail>;
}

export class VoucherError {
    title: string;
    result?: string;
    message?: string;
}

export class VoucherData {
    successful: boolean;
    voucher: VoucherInfo;
    err?: VoucherError;
    sendEmail?: boolean;
    isPayment?: boolean;
}
