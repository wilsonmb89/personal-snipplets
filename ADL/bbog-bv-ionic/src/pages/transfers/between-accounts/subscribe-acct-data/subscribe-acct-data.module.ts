import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubscribeAcctDataPage } from './subscribe-acct-data';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    SubscribeAcctDataPage
  ],
  imports: [
    IonicPageModule.forChild(SubscribeAcctDataPage),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SubscribeAcctDataPageModule {}
