import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubscribeAcctPersonPage } from './subscribe-acct-person';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';


@NgModule({
  declarations: [
    SubscribeAcctPersonPage,
  ],
  imports: [
    IonicPageModule.forChild(SubscribeAcctPersonPage),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SubscribeAcctPersonPageModule {}
