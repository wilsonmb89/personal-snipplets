import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FingerPrintSuccessPage } from './finger-print-success';
import { DirectivesModule } from '../../directives/directives.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FingerPrintSuccessPage,
  ],
  imports: [
    IonicPageModule.forChild(FingerPrintSuccessPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class FingerPrintSuccessPageModule {}
