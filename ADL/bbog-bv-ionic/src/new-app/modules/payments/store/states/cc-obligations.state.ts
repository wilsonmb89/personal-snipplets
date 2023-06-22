import { PaymentObligation } from '../../../../core/services-apis/transfer/transfer-core/models/payment-obligations.model';

export interface CCObligationsState {
    paymentObligations: PaymentObligation[];
    working: boolean;
    completed: boolean;
    error: any;
}
