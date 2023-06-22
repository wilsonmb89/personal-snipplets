import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PocketGoalPage } from './pocket-goal';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { DirectivesModule } from '../../../../../../../directives/directives.module';
import {SelectAccountHandlerProvider} from '../../../../../../../providers/select-account-handler/select-account-handler';


@NgModule({
  declarations: [
    PocketGoalPage,
  ],
  imports: [
    IonicPageModule.forChild(PocketGoalPage),
    ComponentsModule,
    DirectivesModule
  ],
  providers: [
    SelectAccountHandlerProvider
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PocketGoalPageModule {}
