import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { FacilpassSetNurePage } from './facilpass-set-nure';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { FlowHeaderComponentModule } from '@app/shared/components/flow/flow-header/flow-header.module';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { GenericModalModule } from '@app/shared/components/modals/generic-modal/generic-modal.module';

@NgModule({
  declarations: [
    FacilpassSetNurePage
  ],
  imports: [
    IonicPageModule.forChild(FacilpassSetNurePage),
    FlowHeaderComponentModule,
    BdbUtilsModule,
    ComponentsModule,
    GenericModalModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FacilpassSetNurePageModule {}
