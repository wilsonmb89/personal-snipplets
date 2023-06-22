import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashAdvanceOriginPage } from './cash-advance-origin';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    CashAdvanceOriginPage,
  ],
  imports: [
    IonicPageModule.forChild(CashAdvanceOriginPage),
    ComponentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class CashAdvanceOriginPageModule {}
