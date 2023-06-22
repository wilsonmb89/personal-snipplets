import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrustAgreementAmountPage } from './trust-agreement-amount';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    TrustAgreementAmountPage,
  ],
  imports: [
    IonicPageModule.forChild(TrustAgreementAmountPage),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrustAgreementAmountPageModule {}
