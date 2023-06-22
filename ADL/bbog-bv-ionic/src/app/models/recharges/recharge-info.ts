import { BdbMap } from '../bdb-generics/bdb-map';
import { ProductDetail } from '../products/product-model';

export class RechargeInfo {
    carrier: BdbMap;
    amount: string;
    phoneNumber: string;
    account: ProductDetail;
    transactionCost: string;
}
