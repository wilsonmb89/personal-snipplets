import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewTransferMenuPage } from './new-transfer-menu';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';
import { TransfersDestinationAcctPage } from '../../pages/transfers/between-accounts/transfers-destination-acct/transfers-destination-acct';
import { CashAdvanceOriginPage } from '../../pages/transfers/cash-advance/cash-advance-origin/cash-advance-origin';
import { HistoryPage } from '../../pages/payments/history/history';
import { TrustAgreementTargetPage } from '../../pages/transfers/trust-funds/trust-agreement-target/trust-agreement-target';
import { LoanTransferOriginPage } from '../../pages/transfers/loan-transfer/loan-transfer-origin/loan-transfer-origin';
import { DefaultViewMenuComponent } from '../../components/default-view-menu/default-view-menu';
import { HistoryPageModule } from '../../pages/payments/history/history.module';
import { CashAdvanceOriginPageModule } from '../../pages/transfers/cash-advance/cash-advance-origin/cash-advance-origin.module';
import { LoanTransferOriginPageModule } from '../../pages/transfers/loan-transfer/loan-transfer-origin/loan-transfer-origin.module';
import { TransfersDestinationAcctPageModule } from '../../pages/transfers/between-accounts/transfers-destination-acct/transfers-destination-acct.module';

@NgModule({
  declarations: [
    NewTransferMenuPage,
    TrustAgreementTargetPage,
  ],
  imports: [
    IonicPageModule.forChild(NewTransferMenuPage),
    ComponentsModule,
    DirectivesModule,
    HistoryPageModule,
    CashAdvanceOriginPageModule,
    LoanTransferOriginPageModule,
    TransfersDestinationAcctPageModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    TransfersDestinationAcctPage,
    CashAdvanceOriginPage,
    HistoryPage,
    TrustAgreementTargetPage,
    LoanTransferOriginPage,
    DefaultViewMenuComponent
  ],
})
export class NewTransferMenuPageModule {
}
