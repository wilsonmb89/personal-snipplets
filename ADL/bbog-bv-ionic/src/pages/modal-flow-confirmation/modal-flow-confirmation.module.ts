import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalFlowConfirmationPage } from './modal-flow-confirmation';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    ModalFlowConfirmationPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalFlowConfirmationPage),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalFlowConfirmationPageModule {}
