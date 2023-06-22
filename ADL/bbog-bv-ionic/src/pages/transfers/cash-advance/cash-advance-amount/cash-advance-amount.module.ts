import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashAdvanceAmountPage } from './cash-advance-amount';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    CashAdvanceAmountPage,
  ],
  imports: [
    IonicPageModule.forChild(CashAdvanceAmountPage),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CashAdvanceAmountPageModule {}
