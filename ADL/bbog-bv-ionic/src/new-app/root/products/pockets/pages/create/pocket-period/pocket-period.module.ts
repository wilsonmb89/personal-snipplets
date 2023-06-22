import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PocketPeriodPage } from './pocket-period';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { DirectivesModule } from '../../../../../../../directives/directives.module';

@NgModule({
  declarations: [
    PocketPeriodPage,
  ],
  imports: [
    IonicPageModule.forChild(PocketPeriodPage),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PocketPeriodPageModule { }
