import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatementSelectPage } from './statement-select';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    StatementSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(StatementSelectPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class StatementSelectPageModule {}
