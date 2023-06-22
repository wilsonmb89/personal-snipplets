import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DonationAmountPage } from './donation-amount';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [

    DonationAmountPage,
  ],
  imports: [
    IonicPageModule.forChild(DonationAmountPage),
    ComponentsModule,
    DirectivesModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DonationAmountPageModule {}
