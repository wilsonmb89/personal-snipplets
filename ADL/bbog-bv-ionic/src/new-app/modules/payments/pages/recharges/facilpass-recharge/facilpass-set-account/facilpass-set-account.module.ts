import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { FacilpassSetAccountPage } from './facilpass-set-account';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { FlowHeaderComponentModule } from '@app/shared/components/flow/flow-header/flow-header.module';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { RadioSelectionOptionsComponentModule } from '@app/shared/components/radio-selection-options/radio-selection-options.module';
import { TransactionResultPaymentsModule } from '@app/shared/modules/transaction-result/services/payments/transaction-result-payments.module';
import { RechargesService } from '@app/modules/payments/services/recharges.service';
import { GenericModalModule } from '@app/shared/components/modals/generic-modal/generic-modal.module';

@NgModule({
  declarations: [
    FacilpassSetAccountPage
  ],
  imports: [
    IonicPageModule.forChild(FacilpassSetAccountPage),
    FlowHeaderComponentModule,
    BdbUtilsModule,
    ComponentsModule,
    RadioSelectionOptionsComponentModule,
    TransactionResultPaymentsModule,
    GenericModalModule,
  ],
  providers: [
    RechargesService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FacilpassSetAccountPageModule {}
