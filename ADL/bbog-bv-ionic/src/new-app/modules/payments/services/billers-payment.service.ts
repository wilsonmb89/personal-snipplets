import { Injectable } from '@angular/core';
import { PaymentCoreApiService } from '@app/apis/payment-core/payment-core-api.service';
import {
  BillerInfoList,
  BillerMngrRequest,
  BillerMngrResponse
} from '@app/apis/payment-core/models/billers-payment.model';
import { Observable } from 'rxjs/Observable';
import { BillInfo } from '../../../../app/models/bills/bill-info';
import { BillCovenant } from '../../../../app/models/bills/bill-covenant';
import { CreateBillRs, DeleteInvoiceRs } from '@app/apis/payment-core/models/payment-agreement.model';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class BillersPaymentService {

  constructor(
    private paymentCoreApiService: PaymentCoreApiService
  ) {
  }

  private buildDeleteBillRq(billInfo: BillInfo): BillerMngrRequest {
    return {
      nickname: billInfo.nickname,
      nie: billInfo.nie,
      orgIdNum: billInfo.orgIdNum
    };
  }

  public getBillersPayment(): Observable<BillerInfoList[]> {
    return this.paymentCoreApiService.getBillersPayment()
      .map(e => e.billerInfoList);
  }

  public deleteBill(billInfo: BillInfo): Observable<BillerMngrResponse> {
    const billerMngrRequest = this.buildDeleteBillRq(billInfo);
    return this.paymentCoreApiService.deleteBill(billerMngrRequest);
  }

  public createBill(covenant: BillCovenant): Observable<CreateBillRs> {
    return this.paymentCoreApiService.createBill({
      orgIdNum: covenant.covenantNumber,
      nickname: covenant.productName,
      nie: covenant.productId
    });
  }

  public deleteInvoice(billInfo: BillInfo): Observable<DeleteInvoiceRs> {
    return this.paymentCoreApiService.deleteInvoice(
      {
        invoiceNum: billInfo.invoiceNum,
        nie: billInfo.nie,
        orgIdNum: billInfo.orgIdNum
      });
  }

}
