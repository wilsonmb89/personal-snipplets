import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCovid19InfoPage } from './modal-covid-19-info';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    ModalCovid19InfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCovid19InfoPage),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalCovid19InfoPageModule {}
