import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubscribeOblCreditsIdPage } from './subscribe-obl-credits-id';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    SubscribeOblCreditsIdPage,
  ],
  imports: [
    IonicPageModule.forChild(SubscribeOblCreditsIdPage),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SubscribeOblCreditsIdPageModule {}
