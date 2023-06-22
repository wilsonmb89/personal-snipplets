import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PocketAmountPage } from './pocket-amount';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { DirectivesModule } from '../../../../../../../directives/directives.module';

@NgModule({
  declarations: [
    PocketAmountPage,
  ],
  imports: [
    IonicPageModule.forChild(PocketAmountPage),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PocketAmountPageModule {}
