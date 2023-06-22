import { AccountAny } from '../enrolled-transfer/account-any';
import { ProductDetail } from '../products/product-model';

export class TransferInfo {
    accountTo: AccountAny;
    amount: string;
    account: ProductDetail;
    note: string;
    billId: string;
    isAval: boolean;
    transactionCost: string;
    idempotencyKey?: string;

    constructor() {}
}
