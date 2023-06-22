import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { FacilpassSetAmountPage } from './facilpass-set-amount';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { FlowHeaderComponentModule } from '@app/shared/components/flow/flow-header/flow-header.module';
import { ComponentsModule } from '../../../../../../../components/components.module';

@NgModule({
  declarations: [
    FacilpassSetAmountPage
  ],
  imports: [
    IonicPageModule.forChild(FacilpassSetAmountPage),
    FlowHeaderComponentModule,
    BdbUtilsModule,
    ComponentsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FacilpassSetAmountPageModule {}
