import { NgModule } from '@angular/core';
import { ProductsApisModule } from '../../services-apis/products/products-apis.module';
import { TransactionHistoryDelegateService } from './transaction-history-delegate.service';

@NgModule({
  declarations: [],
  imports: [ProductsApisModule],
  providers: [TransactionHistoryDelegateService],
})
export class TransactionHistoryDelegateModule {}
