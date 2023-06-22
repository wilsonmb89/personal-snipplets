import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReferencesSelectAccountPage } from './references-select-account';
import {ComponentsModule} from '../../../../components/components.module';

@NgModule({
  declarations: [
    ReferencesSelectAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(ReferencesSelectAccountPage),
    ComponentsModule
  ],
})
export class ReferencesSelectAccountPageModule {}
