import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailAndTxhistoryPage } from './detail-and-txhistory';
import { ComponentsModule } from '../../components/components.module';
import { BdbCardDetailModule } from '../../components/core/molecules/bdb-card-detail';
import { DirectivesModule } from '../../directives/directives.module';
import { TransactionHistoryDelegateModule } from '@app/delegate/transaction-history/transaction-history-delegate.module';
import { ProductsComponentsModule } from '@app/modules/products/components/products-components.module';
import { CommonModule } from '@angular/common';
import { ModalFilterComponent } from '@app/shared/components/modals/modal-filter/modal-filter';
import { ModalFilterModule } from '@app/shared/components/modals/modal-filter/modal-filter.module';
import { CustomerBasicDataDelegateModule } from '@app/delegate/customer-basic-data-delegate/customer-basic-data-delegate.module';
import { PulseToastService } from '@app/shared/components/pulse-toast/provider/pulse-toast.service';
import { CardsCampaignModule } from '@app/shared/components/campaigns/cards-campaign/cards-campaign.module';
import {PaymentsModule} from '@app/modules/payments/payments.module';

@NgModule({
  declarations: [
    DetailAndTxhistoryPage
  ],
    imports: [
        IonicPageModule.forChild(DetailAndTxhistoryPage),
        ComponentsModule,
        BdbCardDetailModule,
        DirectivesModule,
        TransactionHistoryDelegateModule,
        ProductsComponentsModule,
        CommonModule,
        ModalFilterModule,
        CustomerBasicDataDelegateModule,
        CardsCampaignModule
    ],
  exports: [
    ModalFilterComponent
  ],
  providers: [
    PulseToastService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetailAndTxhistoryPageModule {
}
