import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalGenericInfoPage } from './modal-generic-info';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ModalGenericInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalGenericInfoPage),
    ComponentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalGenericInfoPageModule {}
