import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalTransactionsPage } from './modal-transactions';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ModalTransactionsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalTransactionsPage),
    ComponentsModule
  ],
})
export class ModalTransactionsPageModule {}
