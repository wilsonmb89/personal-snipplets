import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FingerPrintAlertPage } from './finger-print-alert';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    FingerPrintAlertPage,
  ],
  imports: [
    IonicPageModule.forChild(FingerPrintAlertPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class FingerPrintAlertPageModule {}
