import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentsModule } from '../../../../../components/components.module';
import { FlowHeaderComponentModule } from '@app/shared/components/flow/flow-header/flow-header.module';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { IonicPageModule } from 'ionic-angular';
import { ActivatedCardPage } from './activated-card';
import { DirectivesModule } from '../../../../../directives/directives.module';
import { TxInProgressModule } from '@app/shared/components/tx-in-progress/tx-in-progress.module';
import { CreditCardComponentModule } from '../../../../../new-app/shared/components/credit-card/credit-card.module';
import { ToggleComponentModule } from '@app/shared/components/toggle/toggle.module';
import { ProductsComponentsModule } from '../../components/products-components.module';

@NgModule({
  declarations: [
    ActivatedCardPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivatedCardPage),
    FlowHeaderComponentModule,
    ComponentsModule,
    BdbUtilsModule,
    TxInProgressModule,
    DirectivesModule,
    CreditCardComponentModule,
    ToggleComponentModule,
    ProductsComponentsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ActivatedCardPageModule { }
