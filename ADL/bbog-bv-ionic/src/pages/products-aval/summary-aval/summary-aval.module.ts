import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SummaryAvalPage } from './summary-aval';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    SummaryAvalPage,
  ],
  imports: [
    IonicPageModule.forChild(SummaryAvalPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class SummaryAvalPageModule {}
