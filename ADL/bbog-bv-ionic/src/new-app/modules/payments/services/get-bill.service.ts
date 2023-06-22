import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {GetBillRq, GetBillRs} from '@app/apis/payment-billers/models/payment-billers-api.model';
import {PaymentBillersApiService} from '@app/apis/payment-billers/payment-billers-api.service';

@Injectable()
export class GetBillService {

    constructor(
        private billersApiService: PaymentBillersApiService
    ) { }

    public mapBillerMngrRq(data): GetBillRq {
        return {
            billNum: data.ref,
            orgId: data.type.orgIdNum,
            includePaymentCustomInfo: true
        };
    }

    public getBiller(rq: GetBillRq ): Observable<GetBillRs> {
        return this.billersApiService.getBill(rq)
            .map(e => e);
    }

}
