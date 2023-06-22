import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LimitsPage } from './limits';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { CustomerSecurityDelegateModule } from '@app/delegate/customer-security-delegate/customer-security-delegate.module';
import { ServiceApiErrorModalModule } from '@app/shared/components/modals/service-api-error-modal/service-api-error-modal.module';

@NgModule({
  declarations: [
    LimitsPage,
  ],
  imports: [
    IonicPageModule.forChild(LimitsPage),
    ComponentsModule,
    DirectivesModule,
    CustomerSecurityDelegateModule,
    ServiceApiErrorModalModule
  ],
})
export class LimitsPageModule { }
