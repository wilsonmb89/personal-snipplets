import { Injectable } from '@angular/core';
import { DonationRq, DonationRs } from '@app/apis/payment-nonbillers/models/donations.model';
import { ApiProductDetail } from '@app/apis/products/products/models/products';
import { Observable } from 'rxjs/Observable';
import { PaymentNonBillersApiService } from '../../../core/services-apis/payment-nonbillers/payment-nonbillers-api.service';

@Injectable()
export class DonationsService {

    constructor(
        private paymentNonBillersApiService: PaymentNonBillersApiService
    ) { }

    public applyDonation(
        amount: number,
        enterpriseId: string,
        acct: ApiProductDetail
    ): Observable<DonationRs> {

        const donationRq: DonationRq = {
            amount,
            enterpriseId,
            acctId: acct.productNumber,
            acctType: acct.productBankType
        };

        return this.paymentNonBillersApiService.applyDonation(donationRq);
    }

}
