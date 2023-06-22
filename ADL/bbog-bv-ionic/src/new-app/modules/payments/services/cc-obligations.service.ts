import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TransferCoreService } from '../../../../new-app/core/services-apis/transfer/transfer-core/transfer-core.service';
import { PaymentObligation } from '../../../core/services-apis/transfer/transfer-core/models/payment-obligations.model';

@Injectable()
export class CCobligationsService {

    constructor(
        private transferCoreService: TransferCoreService
    ) { }

    public getCreditCardPaymentObligations(): Observable<PaymentObligation[]> {
        return this.transferCoreService.getCreditCardPaymentObligations()
            .map(e => e.paymentObligations);
    }

}
