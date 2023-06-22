import { ProductDetail } from '../products/product-model';

export class LoanTransferInfo {
    loan: ProductDetail;
    amount: string;
    account: ProductDetail;
    transactionCost: string;

    constructor() {}
}
