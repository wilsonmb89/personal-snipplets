import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpiredSessionPage } from './expired-session';
import { DirectivesModule } from '../../directives/directives.module';
import {BdbModalProvider} from '../../providers/bdb-modal/bdb-modal';

@NgModule({
  declarations: [
    ExpiredSessionPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpiredSessionPage),
    DirectivesModule
  ],
  providers: [
  BdbModalProvider
  ]
})
export class ExpiredSessionPageModule {}
