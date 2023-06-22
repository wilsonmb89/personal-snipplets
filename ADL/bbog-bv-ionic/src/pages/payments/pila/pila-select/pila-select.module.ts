import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PilaSelectPage } from './pila-select';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { PaymentsModule } from '@app/modules/payments/payments.module';
import { ListParametersDelegateModule } from '@app/delegate/list-parameters/list-parameters-delegate.module';

@NgModule({
  declarations: [
    PilaSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(PilaSelectPage),
    ComponentsModule,
    DirectivesModule,
    PaymentsModule,
    ListParametersDelegateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class PilaSelectPageModule {
}
