import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubscribeBillIdPage } from './subscribe-bill-id';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    SubscribeBillIdPage,
  ],
  imports: [
    IonicPageModule.forChild(SubscribeBillIdPage),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SubscribeBillIdPageModule {}
