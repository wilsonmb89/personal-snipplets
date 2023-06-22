import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCashAdvancePage } from './modal-cash-advance';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    ModalCashAdvancePage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCashAdvancePage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class ModalCashAdvancePageModule {}
