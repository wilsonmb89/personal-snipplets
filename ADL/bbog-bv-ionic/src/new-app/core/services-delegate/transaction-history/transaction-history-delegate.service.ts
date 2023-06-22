import { Injectable } from '@angular/core';
import { ProductsDetailService } from '../../services-apis/products/products-detail/products-detail.service';

import { Observable } from 'rxjs/Observable';
import { GetTransactionHistoryRq } from 'new-app/core/services-apis/products/products-detail/models/GetTransactionHistoryRq';
import { GetTransactionHistoryRs } from 'new-app/core/services-apis/products/products-detail/models/GetTransactionHistoryRs';
import { TransactionsDate } from 'app/models/transactions/transactions-date';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TransactionHistoryDelegateService {

  constructor(private productsDetailService: ProductsDetailService) {}

  getTransactionHistory(request: GetTransactionHistoryRq): Observable<TransactionsDate[]> {
    return this.productsDetailService
      .getTransactionHistory(request)
      .pipe(
        map((response) => this.buildResponse(response)),
        catchError(error => this.handleTransactionHistoryError(error))
      );
  }

  private buildResponse(response: GetTransactionHistoryRs): TransactionsDate[] {
    const reduceDates = (dates, transaction) =>
      dates.includes(transaction.date) ? dates : [...dates, transaction.date];

    return response.finalTransactionList.reduce(reduceDates, []).map((date) => ({
      date,
      transactions: response.finalTransactionList
        .filter(transaction => transaction.date === date)
        .map(transaction => ({
          date: transaction.date,
          description: transaction.description,
          amount: {amount: +transaction.amount, positive: +transaction.amount > 0},
          installments: +transaction.instalments,
          symbol: +transaction.amount > 0 ? '+' : ''
        })
      )
    }));
  }

  private handleTransactionHistoryError(error: HttpErrorResponse) {
    return error.status === 409 && error.error.businessErrorCode === '1120' ? of([]) : Observable.throw(error);
  }
}
