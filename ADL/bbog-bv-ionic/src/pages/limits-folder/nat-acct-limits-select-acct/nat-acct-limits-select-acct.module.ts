import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NatAcctLimitsSelectAcctPage } from './nat-acct-limits-select-acct';
import { ComponentsModule } from '../../../components/components.module';
import { CustomerSecurityDelegateModule } from '@app/delegate/customer-security-delegate/customer-security-delegate.module';
import { ServiceApiErrorModalModule } from '@app/shared/components/modals/service-api-error-modal/service-api-error-modal.module';

@NgModule({
  declarations: [
    NatAcctLimitsSelectAcctPage,
  ],
  imports: [
    IonicPageModule.forChild(NatAcctLimitsSelectAcctPage),
    ComponentsModule,
    CustomerSecurityDelegateModule,
    ServiceApiErrorModalModule
  ],
})
export class NatAcctLimitsSelectAcctPageModule {}
