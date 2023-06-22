import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryPage } from './history';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { TxHistoryWebModule } from '../../../components/tx-history-web/tx-history-web.module';
import {GenericVouchersModule} from '../../../new-app/modules/vouchers/generic-vouchers.module';
import {GenericVoucherPageModule} from '../../../new-app/modules/vouchers/pages/generic-voucher/generic-voucher.module';
import { TransactionResultHistoryModule } from '@app/shared/modules/transaction-result/services/history/transaction-result-history.module';

@NgModule({
  declarations: [
    HistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoryPage),
    ComponentsModule,
    DirectivesModule,
    TxHistoryWebModule,
    GenericVouchersModule,
    GenericVoucherPageModule,
    TransactionResultHistoryModule
  ],
  exports: [HistoryPage]
})
export class HistoryPageModule { }
