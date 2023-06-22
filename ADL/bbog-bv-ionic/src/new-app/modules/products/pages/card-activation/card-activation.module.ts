import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentsModule } from '../../../../../components/components.module';
import { FlowHeaderComponentModule } from '@app/shared/components/flow/flow-header/flow-header.module';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { IonicPageModule } from 'ionic-angular';
import { CardActivationPage } from './card-activation';
import {DirectivesModule} from '../../../../../directives/directives.module';
import { CreditCardComponentModule } from '../../../../../new-app/shared/components/credit-card/credit-card.module';
import { GenericModalModule } from '@app/shared/components/modals/generic-modal/generic-modal.module';

@NgModule({
  declarations: [
    CardActivationPage,
  ],
  imports: [
    IonicPageModule.forChild(CardActivationPage),
    FlowHeaderComponentModule,
    ComponentsModule,
    BdbUtilsModule,
    DirectivesModule,
    CreditCardComponentModule,
    GenericModalModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CardActivationPageModule {}
