import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { BillersPaymentService } from '../../new-app/modules/payments/services/billers-payment.service';

@Injectable()
export class PaymentsProvider {

  constructor(
    private bdbInMemoryProvider: BdbInMemoryProvider,
    private loadingCtrl: LoadingController,
    private billersPaymentService: BillersPaymentService
  ) { }

  dismiss(data, loading) {
    loading.dismiss();
  }

  error(err, loading) {
    loading.dismiss();
  }



  enrollNewBillRq(
    next?: (value: any) => void,
    error?: (error: any) => void
  ) {
    const covenant = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.BillCovenant);
    const loading = this.loadingCtrl.create();
    loading.present().then(() => {
      this.billersPaymentService.createBill(covenant).subscribe(
        data => {
          this.dismiss(data, loading);
          next(data);
        },
        err => {
          this.dismiss(err, loading);
          error(err);
        }
      );
    });
  }
}
