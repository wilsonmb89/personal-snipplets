import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../components/components.module';
import { DefaultViewMenuComponent } from '../../../components/default-view-menu/default-view-menu';
import { DirectivesModule } from '../../../directives/directives.module';
import { BillSelelectPage } from '../../../pages/payments/bills/bill-selelect/bill-selelect';
import { CCDestinationAcctPage } from '../../../pages/payments/credit-card/cc-destination-acct/cc-destination-acct';
import { LoanDestinationAcctPage } from '../../../pages/payments/credits/loan-destination-acct/loan-destination-acct';
import { HistoryPage } from '../../../pages/payments/history/history';
import { PaymentsMainPage } from './payments-main';
import { HistoryPageModule } from '../../../pages/payments/history/history.module';
import { PilaSelectPage } from '../../../pages/payments/pila/pila-select/pila-select';
import { PilaSelectPageModule } from '../../../pages/payments/pila/pila-select/pila-select.module';
import { PaymentsModule } from '../../../new-app/modules/payments/payments.module';
import { TaxSelectPageModule } from '../../../new-app/modules/payments/pages/taxes/tax-select/tax-select.module';
import { ListParametersDelegateModule } from '@app/delegate/list-parameters/list-parameters-delegate.module';
import { LoanOpsProvider } from '../../../providers/loan-ops/loan-ops';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';
import { CreditCardOpsProvider } from '../../../providers/credit-card-ops/credit-card-ops';
import { PulseToastService } from '@app/shared/components/pulse-toast/provider/pulse-toast.service';
import { RechargeChoicePage } from '@app/modules/payments/pages/recharges/recharge-choice/recharge-choice';
import { RechargeChoicePageModule } from '@app/modules/payments/pages/recharges/recharge-choice/recharge-choice.module';

@NgModule({
  declarations: [
    PaymentsMainPage,
    BillSelelectPage,
    CCDestinationAcctPage,
    LoanDestinationAcctPage
  ],
  providers: [
    LoanOpsProvider,
    CreditCardOpsProvider,
    PulseToastService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicPageModule.forChild(PaymentsMainPage),
    ComponentsModule,
    DirectivesModule,
    HistoryPageModule,
    PilaSelectPageModule,
    RechargeChoicePageModule,
    PaymentsModule,
    TaxSelectPageModule,
    ListParametersDelegateModule,
    TransactionResultTrasfersModule,
    ListParametersDelegateModule
  ],
  entryComponents: [
    BillSelelectPage,
    CCDestinationAcctPage,
    LoanDestinationAcctPage,
    PilaSelectPage,
    HistoryPage,
    DefaultViewMenuComponent,
    RechargeChoicePage
  ]
})
export class PaymentsMainPageModule { }
