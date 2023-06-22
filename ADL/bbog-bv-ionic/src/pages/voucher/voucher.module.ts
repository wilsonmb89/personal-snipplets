import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VoucherPage } from './voucher';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    VoucherPage,
  ],
  imports: [
    IonicPageModule.forChild(VoucherPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class VoucherPageModule { }
