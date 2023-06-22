import { BdbMap } from '../bdb-generics/bdb-map';
import { ProductDetail } from '../products/product-model';
import { ButtonRs } from './button-rs';

export class ModalRs {
    constructor(
        public modalCode?: string,
        public status?: number,
        public authCode?: string,
        public transactionDate?: string,
        public transactionFee?: string,
        public message?: string,
        public title?: string,
        public button?: ButtonRs,
        public paymentMethod?: ProductDetail,
        public details?: Array<BdbMap>
    ) { }
}
