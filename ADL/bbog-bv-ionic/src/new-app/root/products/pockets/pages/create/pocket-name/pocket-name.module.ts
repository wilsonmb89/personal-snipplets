import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PocketNamePage } from './pocket-name';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { DirectivesModule } from '../../../../../../../directives/directives.module';

@NgModule({
  declarations: [
    PocketNamePage,
  ],
  imports: [
    IonicPageModule.forChild(PocketNamePage),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PocketNamePageModule { }
