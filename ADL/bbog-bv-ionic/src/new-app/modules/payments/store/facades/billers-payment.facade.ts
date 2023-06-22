import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { BillerInfoList } from '../../../../core/services-apis/payment-core/models/billers-payment.model';
import * as fromBillerInfoList from '../actions/billers-payment.action';
import * as billerInfoListSelector from '../selectors/billers-payment.selector';
import { BillersPaymentState } from '../states/payment-core.state';
import { BdbShortcutCard } from '../../../../../app/models/bdb-shortcut-card';
import { BdbItemCardModel } from '../../../../../components/bdb-item-card-v2/bdb-item-card-v2';
import { BillInfo } from '../../../../../app/models/bills/bill-info';

@Injectable()
export class BillersPaymentFacade {

    billersPayment$: Observable<BillerInfoList[]> = this.store.select(billerInfoListSelector.getAllBillerInfoList);
    billersPaymentWorking$: Observable<boolean> = this.store.select(billerInfoListSelector.getAllBillerInfoListWorking);
    billersPaymentCompleted$: Observable<boolean> = this.store.select(billerInfoListSelector.getAllBillerInfoListCompleted);
    billersPaymentError$: Observable<any> = this.store.select(billerInfoListSelector.getAllBillerInfoListError);
    billersPaymentMapOld$: Observable<BillInfo[]> = this.store.select(billerInfoListSelector.getAllBillerInfoListOld);
    pendingBills$: Observable<BdbShortcutCard[]> = this.store.select(billerInfoListSelector.getPendingBillsShortcutCard);
    sortingBillsHasInvoice$: Observable<BdbItemCardModel[]> = this.store.select(billerInfoListSelector.sortBillsHasInvoice);
    billsNotHasInvoice$: Observable<BdbItemCardModel[]> = this.store.select(billerInfoListSelector.billsNotHasInvoice);

    constructor(private store: Store<BillersPaymentState>) { }

    public fetchBillersPayment(): void {
        this.store.dispatch(new fromBillerInfoList.FetchBillersPaymentAction());
    }

    public removeBillersPayment(): void {
        this.store.dispatch(new fromBillerInfoList.RemoveBillersPaymentAction());
    }

    public updateBillersPayment(): void {
        this.removeBillersPayment();
        this.fetchBillersPayment();
    }

}
