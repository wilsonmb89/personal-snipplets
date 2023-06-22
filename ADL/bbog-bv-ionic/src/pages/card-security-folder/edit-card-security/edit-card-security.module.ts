import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditCardSecurityPage } from './edit-card-security';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    EditCardSecurityPage,
  ],
  imports: [
    IonicPageModule.forChild(EditCardSecurityPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class EditCardSecurityPageModule { }
