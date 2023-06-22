import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleBillPage } from './schedule-bill';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';
import { PaymentsModule } from '../../new-app/modules/payments/payments.module';

@NgModule({
  declarations: [
    ScheduleBillPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleBillPage),
    ComponentsModule,
    DirectivesModule,
    PaymentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ScheduleBillPageModule { }
