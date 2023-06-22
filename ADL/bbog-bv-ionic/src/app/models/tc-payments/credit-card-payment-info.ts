import { AccountAny } from '../enrolled-transfer/account-any';
import { ProductDetail } from '../products/product-model';

export class CreditCardPaymentInfo {
        creditCard: AccountAny;
        amount: string;
        account: ProductDetail;
        paymentType: string;
        isAval: boolean;
        transactionCost: string;
        franchise: string;
}
