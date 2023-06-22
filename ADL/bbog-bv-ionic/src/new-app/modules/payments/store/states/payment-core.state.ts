import { BillerInfoList } from '../../../../core/services-apis/payment-core/models/billers-payment.model';

export interface BillersPaymentState {
    billerInfoList: BillerInfoList[];
    working: boolean;
    completed: boolean;
    error: any;
}
