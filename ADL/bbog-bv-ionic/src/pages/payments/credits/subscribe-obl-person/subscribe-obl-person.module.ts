import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubscribeOblPersonPage } from './subscribe-obl-person';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    SubscribeOblPersonPage,
  ],
  imports: [
    IonicPageModule.forChild(SubscribeOblPersonPage),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SubscribeOblPersonPageModule {}
