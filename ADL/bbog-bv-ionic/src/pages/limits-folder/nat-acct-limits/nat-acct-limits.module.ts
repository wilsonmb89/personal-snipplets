import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NatAcctLimitsPage } from './nat-acct-limits';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { CustomerSecurityDelegateModule } from '@app/delegate/customer-security-delegate/customer-security-delegate.module';
import { ServiceApiErrorModalModule } from '@app/shared/components/modals/service-api-error-modal/service-api-error-modal.module';

@NgModule({
  declarations: [
    NatAcctLimitsPage,
  ],
  imports: [
    IonicPageModule.forChild(NatAcctLimitsPage),
    ComponentsModule,
    DirectivesModule,
    CustomerSecurityDelegateModule,
    ServiceApiErrorModalModule
  ],
})
export class NatAcctLimitsPageModule {}
