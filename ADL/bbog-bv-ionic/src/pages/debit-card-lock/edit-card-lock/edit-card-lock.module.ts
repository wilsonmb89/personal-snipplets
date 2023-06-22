import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditCardLockPage } from './edit-card-lock';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    EditCardLockPage,
  ],
  imports: [
    IonicPageModule.forChild(EditCardLockPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class EditCardLockPageModule {}
