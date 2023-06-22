import { Injectable } from '@angular/core';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductsService } from '../../services-apis/products/products/products.service';
import { LoyaltyProgramRs } from '../../services-apis/products/products/models/LoyaltyProgramRs';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { TransactionsInquiryRequest } from '@app/apis/products/products/models/loyalty-transactions.model';
import { FilterDateParams, TuPlusDetail } from '../../../../providers/tu-plus-ops';


@Injectable()
export class LoyaltyDelegateService {

  private ERROR_CLIENT_NOT_HAVE_LOYALTY = 'Client not have loyalty program.';

  constructor(
    private bdbStorageService: BdbStorageService,
    private productsService: ProductsService
  ) { }

  public getLoyaltyBalance(): Observable<LoyaltyProgramRs> {
    const dataFromMemory = this.bdbStorageService.getItemByKey(InMemoryKeys.TuPlusData);

    if (!!dataFromMemory) {
      if (dataFromMemory === this.ERROR_CLIENT_NOT_HAVE_LOYALTY) {
        return Observable.throw(this.ERROR_CLIENT_NOT_HAVE_LOYALTY);
      } else {
        return of(dataFromMemory);
      }
    } else {
      return this.productsService.getLoyaltyProgram()
        .pipe(
          tap(value => {
            this.bdbStorageService.setItemByKey(InMemoryKeys.TuPlusData, value);
          }),
          catchError((e) => {
            return Observable.throw(this.handleError(e));
          })
        );
    }
  }

  public getTransactionsLoyaltyProgram(rangeDate: FilterDateParams): Observable<TuPlusDetail[]> {
    const rq: TransactionsInquiryRequest = {
      startDate: rangeDate.startDate,
      endDate: rangeDate.endDate
    };
    return this.productsService
      .lookForTransactionsLoyaltyProgram(rq)
      .map(
        rs => rs.loyaltyTransactions
          .map(transaction => {
            return {
              bank: transaction.partner,
              date: transaction.date,
              establishment: transaction.establishment,
              accumulatedPoints: transaction.totalPoints,
              amount: transaction.amount,
              product: transaction.product,
              expDt: transaction.expDate,
              transactionType: transaction.transactionType
            };
          })
      );
  }

  private handleError(e: HttpErrorResponse): string {
    if (e.status === 409) {
      this.bdbStorageService.setItemByKey(InMemoryKeys.TuPlusData, this.ERROR_CLIENT_NOT_HAVE_LOYALTY);
      return this.ERROR_CLIENT_NOT_HAVE_LOYALTY;
    }
    return e.error.errorMessage;
  }

}
