import { Customer } from '../bdb-generics/customer';
import { Entity, jsonRsaCrypto } from '../../core/decorators/JsonRsaCrypto';

@Entity
export class DonationDtoRq {
    customer: Customer;
    product: Product;
    curAmt: CurAmt;
    entprId: string;
    @jsonRsaCrypto
    ipAddr: string;

}

@Entity
export class Product {
    acctId: string;
    @jsonRsaCrypto
    acctType: string;
    acctCur: string;
    bankId: string;
}

@Entity
export class CurAmt {
    curCode: string;
    @jsonRsaCrypto
    amt: number;
}
