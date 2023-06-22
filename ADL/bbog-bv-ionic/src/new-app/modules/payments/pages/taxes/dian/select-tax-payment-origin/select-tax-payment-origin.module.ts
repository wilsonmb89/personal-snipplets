import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SelectTaxPaymentOriginPage } from './select-tax-payment-origin';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { GenericModalModule } from '@app/shared/components/modals/generic-modal/generic-modal.module';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { FlowHeaderComponentModule } from '@app/shared/components/flow/flow-header/flow-header.module';
import { RadioSelectionOptionsComponentModule } from '@app/shared/components/radio-selection-options/radio-selection-options.module';
import { PaymentBillersDelegateModule } from '@app/delegate/payment-billers-delegate/payment-billers-delegate.module';
import { TransactionResultPaymentsModule } from '@app/shared/modules/transaction-result/services/payments/transaction-result-payments.module';

@NgModule({
  declarations: [
    SelectTaxPaymentOriginPage
  ],
  imports: [
    IonicPageModule.forChild(SelectTaxPaymentOriginPage),
    ComponentsModule,
    GenericModalModule,
    BdbUtilsModule,
    FlowHeaderComponentModule,
    RadioSelectionOptionsComponentModule,
    PaymentBillersDelegateModule,
    TransactionResultPaymentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SelectTaxPaymentOriginPageModule {}
