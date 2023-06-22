import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalSuccessPage } from './modal-success';

@NgModule({
  declarations: [
    ModalSuccessPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalSuccessPage),
  ],
})
export class ModalSuccessPageModule {}
