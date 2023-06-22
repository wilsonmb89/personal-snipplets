import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaxSelectPage } from './tax-select';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { PaymentBillersDelegateModule } from '../../../../new-app/core/services-delegate/payment-billers-delegate/payment-billers-delegate.module';

@NgModule({
  declarations: [
    TaxSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(TaxSelectPage),
    ComponentsModule,
    DirectivesModule,
    PaymentBillersDelegateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class TaxSelectPageModule {}
