import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanTransferAmountPage } from './loan-transfer-amount';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    LoanTransferAmountPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanTransferAmountPage),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoanTransferAmountPageModule {}
