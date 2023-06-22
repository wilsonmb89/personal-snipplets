import { Customer } from '../bdb-generics/customer';
import { jsonRsaCrypto,  Entity } from '../../core/decorators/JsonRsaCrypto';
import { AccountPay } from './pila';

export class Cities {
    error: string;
    cities: City[];
}


export class City {
    code: string;
    name: string;
}

@Entity
export class TaxCompanyRq {
    customer: Customer;
    @jsonRsaCrypto
    cityId: string;
}


export class PayTaxRq {
    taxInfoRq: TaxInfoRq;
}

@Entity
export class TaxInfoRq {
    account: AccountPay;
    @jsonRsaCrypto
    amount: string;
    @jsonRsaCrypto
    codeNIE: string;
    @jsonRsaCrypto
    codeService: string;
    @jsonRsaCrypto
    taxFormNum: string;


}
