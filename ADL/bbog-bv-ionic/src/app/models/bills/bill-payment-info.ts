import { BillInfo } from './bill-info';
import { ProductDetail } from '../products/product-model';

export class BillPaymentInfo {
    bill: BillInfo;
    amount: string;
    account: ProductDetail;
    transactionCost: string;
}
