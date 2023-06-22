import { PaymentObligation } from '../../../../core/services-apis/transfer/transfer-core/models/payment-obligations.model';
import {HttpErrorResponse} from '@angular/common/http';

export interface AcObligationsState {
  creditObligations: PaymentObligation[];
  working: boolean;
  error: HttpErrorResponse;
  isBogCreditsCompleted: boolean;
  isAvalCreditsCompleted: boolean;
}
