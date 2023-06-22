import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CheckTaxAmountPage } from './check-tax-amount';
import { FlowHeaderComponentModule } from '@app/shared/components/flow/flow-header/flow-header.module';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { GenericModalModule } from '@app/shared/components/modals/generic-modal/generic-modal.module';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';

@NgModule({
  declarations: [
    CheckTaxAmountPage,

  ],
  imports: [
    IonicPageModule.forChild(CheckTaxAmountPage),
    FlowHeaderComponentModule,
    ComponentsModule,
    GenericModalModule,
    BdbUtilsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class CheckTaxAmountPageModule {}
