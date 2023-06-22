import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnrollCreditAliasPage } from './enroll-credit-alias';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import {PaymentsModule} from '../../../../new-app/modules/payments/payments.module';
import {BdbUtilsModule} from '@app/shared/utils/bdb-utils.module';

@NgModule({
  declarations: [
    EnrollCreditAliasPage,
  ],
  imports: [
    IonicPageModule.forChild(EnrollCreditAliasPage),
    ComponentsModule,
    DirectivesModule,
    PaymentsModule,
    BdbUtilsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SubscribeOblAliasPageModule {}
