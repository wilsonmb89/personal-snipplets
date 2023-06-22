import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubscribeOblCreditcardIdPage } from './subscribe-obl-creditcard-id';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    SubscribeOblCreditcardIdPage,
  ],
  imports: [
    IonicPageModule.forChild(SubscribeOblCreditcardIdPage),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SubscribeOblCreditcardIdPageModule {}
