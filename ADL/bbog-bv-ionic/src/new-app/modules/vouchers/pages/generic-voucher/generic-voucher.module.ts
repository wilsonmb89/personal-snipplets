import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {GenericVoucherPage} from './generic-voucher';
import {ComponentsModule} from '../../../../../components/components.module';
import {DirectivesModule} from '../../../../../directives/directives.module';
import {GenericVoucherInfoComponent} from '../voucher-info/generic-voucher-info';
import {GenericVoucherSendEmailComponent} from '../voucher-send-email/generic-voucher-send-email';

@NgModule({
  declarations: [
    GenericVoucherPage,
    GenericVoucherInfoComponent,
    GenericVoucherSendEmailComponent,
  ],
  imports: [
    IonicPageModule.forChild(GenericVoucherPage),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GenericVoucherPageModule { }
