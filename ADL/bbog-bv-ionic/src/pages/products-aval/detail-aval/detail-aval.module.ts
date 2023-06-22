import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailAvalPage } from './detail-aval';
import { DirectivesModule } from '../../../directives/directives.module';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    DetailAvalPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailAvalPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class DetailAvalPageModule {}
