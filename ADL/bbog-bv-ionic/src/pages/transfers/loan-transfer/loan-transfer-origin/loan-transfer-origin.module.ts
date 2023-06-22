import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanTransferOriginPage } from './loan-transfer-origin';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    LoanTransferOriginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanTransferOriginPage),
    ComponentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoanTransferOriginPageModule {}
