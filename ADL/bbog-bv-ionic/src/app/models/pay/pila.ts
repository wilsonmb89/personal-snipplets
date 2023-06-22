import { Customer } from '../bdb-generics/customer';
import { Entity, jsonRsaCrypto } from '../../core/decorators/JsonRsaCrypto';
import {PaymentPilaRq} from '../../../new-app/core/services-apis/payment-billers/models/payment-billers-api.model';


export class TestObjRsa {
    @jsonRsaCrypto
    prop1: string;
}

export class ProviderPila {
    error: string;
    taxes: Tax[];
}

export class BillInfo {
    error: string;
    bill: Bill[];
}


export class Bill {
  amount: number;
  invoiceNum: string;
  codeNIE: string;
  codeService: string;
  extDate: string;
  orgInfoName: string;
}


export class Tax {
    orgIdNum: string;
    name: string;
    svcId: string;
    bankId: string;

}


@Entity
export class BillInfoPilaRq {
    customer: Customer;
    @jsonRsaCrypto
    billNum: string;
    @jsonRsaCrypto
    orgId: string;
    @jsonRsaCrypto
    orgType: string;

}

@Entity
export class AccountPay {
    accountNumber: string;
    @jsonRsaCrypto
    accountType: string;
}

@Entity
export class BillPay {
    @jsonRsaCrypto
    amount: string;
    @jsonRsaCrypto
    codeService: string;
    @jsonRsaCrypto
    orgInfoName: string;
    @jsonRsaCrypto
    invoiceNum: string;
    referenceList: string[];
    codeNIE: string;
    @jsonRsaCrypto
    extDate: string;
}

export class PayPilaRq {
    account: AccountPay;
    bill:  PaymentPilaRq;
}

