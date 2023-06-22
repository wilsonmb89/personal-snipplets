import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnrollCreditCardAliasPage } from './enroll-credit-card-alias';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { PaymentsModule } from '../../../../new-app/modules/payments/payments.module';

@NgModule({
  declarations: [
    EnrollCreditCardAliasPage,
  ],
  imports: [
    IonicPageModule.forChild(EnrollCreditCardAliasPage),
    ComponentsModule,
    DirectivesModule,
    PaymentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SubscribeOblAliasPageModule {}
