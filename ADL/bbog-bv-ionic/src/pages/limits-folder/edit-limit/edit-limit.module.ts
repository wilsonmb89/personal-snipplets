import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditLimitPage } from './edit-limit';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    EditLimitPage,
  ],
  imports: [
    IonicPageModule.forChild(EditLimitPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class EditLimitPageModule {}
