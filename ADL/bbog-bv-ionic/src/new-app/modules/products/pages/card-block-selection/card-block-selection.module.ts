import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentsModule } from '../../../../../components/components.module';
import { IonicPageModule } from 'ionic-angular';
import { CardBlockSelectionPage } from './card-block-selection';
import { DirectivesModule } from '../../../../../directives/directives.module';
import { PulseToastService } from '@app/shared/components/pulse-toast/provider/pulse-toast.service';

@NgModule({
  declarations: [
    CardBlockSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(CardBlockSelectionPage),
    ComponentsModule,
    DirectivesModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    PulseToastService
  ],
})
export class CardBlockSelectionPageModule {}
