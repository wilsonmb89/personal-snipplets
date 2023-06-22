import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardNumberPage } from './card-number';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    CardNumberPage,
  ],
  imports: [
    IonicPageModule.forChild(CardNumberPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class CardNumberPageModule {}
