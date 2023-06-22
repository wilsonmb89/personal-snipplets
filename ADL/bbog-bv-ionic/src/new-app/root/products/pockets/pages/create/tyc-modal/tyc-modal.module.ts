import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TycModalPage } from './tyc-modal';
import { ComponentsModule } from '../../../../../../../components/components.module';

@NgModule({
  declarations: [
    TycModalPage,
  ],
  imports: [
    IonicPageModule.forChild(TycModalPage),
    ComponentsModule
  ],
})
export class TycModalPageModule {}
