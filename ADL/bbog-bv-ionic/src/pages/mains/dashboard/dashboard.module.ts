import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { QuickAccessModule } from '../../../components/quick-access/quick-access.module';
import { PocketCardModule } from '../../../components/pocket-card/pocket-card.module';
import { PocketOpsService } from '../../../new-app/root/products/pockets/services/pocket-ops.service';
import { PaymentsModule } from '../../../new-app/modules/payments/payments.module';
import { PocketsModalsModule } from '../../../new-app/root/products/pockets/components/pockets-modals.module';
import { ProductsDelegateModule } from '@app/delegate/products-delegate/products-delegate.module';
import { DashboardModule } from '../../../new-app/modules/dashboard/dashboard.module';
import { LoanOpsProvider } from '../../../providers/loan-ops/loan-ops';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';
@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    ComponentsModule,
    DirectivesModule,
    QuickAccessModule,
    PocketCardModule,
    ProductsDelegateModule,
    PaymentsModule,
    PocketsModalsModule,
    DashboardModule,
    TransactionResultTrasfersModule
  ],
  providers: [
    PocketOpsService,
    LoanOpsProvider
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class DashboardPageModule { }
