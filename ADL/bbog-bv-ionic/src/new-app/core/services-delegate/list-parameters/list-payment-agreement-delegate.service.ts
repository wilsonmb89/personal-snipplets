import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PaymentCoreApiService } from '@app/apis/payment-core/payment-core-api.service';
import { of as observableOf } from 'rxjs/observable/of';
import {
  InquiriesAgreementDto,
  PaymentAgreementRq
} from '@app/apis/payment-core/models/payment-agreement.model';
import { map } from 'rxjs/operators';
import { ProviderPila } from '../../../../app/models/pay/pila';

@Injectable()
export class ListPaymentAgreementDelegate {
  private paymentAgreementRq: PaymentAgreementRq;

  constructor(
    private paymentCoreService: PaymentCoreApiService
  ) {
  }


  public getAgreements(term: string): Observable<Array<InquiriesAgreementDto>> {

    if (!term.trim() || term.length < 3) {
      return observableOf([]);
    }

    this.paymentAgreementRq = {
      'name': term
    };

    return this.paymentCoreService.getPaymentAgreement(this.paymentAgreementRq).map(e => {
       return e.inquiriesAgreementDtos;
    });
  }

  public getPilaAgreements(): Observable<ProviderPila> {
    return this.paymentCoreService.getPilaAgreements().pipe(
      map(res => ({ error: null, taxes: res.inquiriesAgreementDtos.map(item => ({
          orgIdNum: item.code,
          name: item.name,
          svcId: null,
          bankId: null,
        }))
      }))
    );
  }
}
