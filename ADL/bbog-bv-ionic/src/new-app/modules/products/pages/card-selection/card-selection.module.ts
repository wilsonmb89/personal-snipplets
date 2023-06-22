import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentsModule } from '../../../../../components/components.module';
import { IonicPageModule } from 'ionic-angular';
import { CardSelectionPage } from './card-selection';
import { DirectivesModule } from '../../../../../directives/directives.module';

@NgModule({
  declarations: [
    CardSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(CardSelectionPage),
    ComponentsModule,
    DirectivesModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CardSelectionPageModule {}
