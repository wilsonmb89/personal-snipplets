import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VoucherWindowPage } from './voucher-window';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    VoucherWindowPage,
  ],
  imports: [
    IonicPageModule.forChild(VoucherWindowPage),
    ComponentsModule
  ],
})
export class VoucherWindowPageModule {}
