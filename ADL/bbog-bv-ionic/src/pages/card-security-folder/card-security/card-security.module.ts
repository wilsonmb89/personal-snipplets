import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardSecurityPage } from './card-security';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    CardSecurityPage,
  ],
  imports: [
    IonicPageModule.forChild(CardSecurityPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class CardSecurityPageModule { }
