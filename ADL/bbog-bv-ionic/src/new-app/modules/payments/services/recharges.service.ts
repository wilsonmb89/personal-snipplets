import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { FacipassRechargeRq, FacipassRechargeRs } from '@app/apis/payment-nonbillers/models/facilpass-recharge.model';
import { PaymentNonBillersApiService } from '@app/apis/payment-nonbillers/payment-nonbillers-api.service';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';

@Injectable()
export class RechargesService {

  constructor(
    private paymentNonBillersApiService: PaymentNonBillersApiService,
    private bdbStorageService: BdbStorageService,
  ) {}

  public doFacilpassRecharge(retry: boolean): Observable<FacipassRechargeRs> {
    const facilpassData: FacipassRechargeRq = this.bdbStorageService.getItemByKey(InMemoryKeys.FacilpassData);
    if (!!facilpassData) {
      facilpassData.trxForce = retry;
      facilpassData.amount = facilpassData.amount.replace(/\D/g, '');
      return this.paymentNonBillersApiService.facilpassRecharge(facilpassData);
    }
    return ErrorObservable.create('Input data is missing');
  }
}
