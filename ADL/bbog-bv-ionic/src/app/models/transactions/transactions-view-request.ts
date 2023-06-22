import { ProductDetail } from '../products/product-model';

export class TransactionViewRq {

    constructor(public p: ProductDetail, public identificationNumber: string) {
    }

}
