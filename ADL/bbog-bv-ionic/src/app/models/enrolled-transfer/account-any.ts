import { ProductDetail } from '../products/product-model';
import { AccountBalance } from './account-balance';

export class AccountAny {

    constructor(
        public owned: boolean,
        public accountOwned: ProductDetail,
        public accountEnrolled: AccountBalance
    ) {}
}
