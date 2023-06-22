import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubscribeBillAliasPage } from './subscribe-bill-alias';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { PaymentsModule } from '../../../../new-app/modules/payments/payments.module';

@NgModule({
  declarations: [
    SubscribeBillAliasPage,
  ],
  imports: [
    IonicPageModule.forChild(SubscribeBillAliasPage),
    ComponentsModule,
    DirectivesModule,
    PaymentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SubscribeBillAliasPageModule {}
