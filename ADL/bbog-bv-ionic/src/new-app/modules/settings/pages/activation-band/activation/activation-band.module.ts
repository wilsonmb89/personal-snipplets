import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlowHeaderComponentModule } from '@app/shared/components/flow/flow-header/flow-header.module';
import { IonicPageModule } from 'ionic-angular';
import { ActivationBandPage } from '@app/modules/settings/pages/activation-band/activation/activation-band';
import { CustomerSecurityDelegateModule } from '@app/delegate/customer-security-delegate/customer-security-delegate.module';
import { PulseToastService } from '@app/shared/components/pulse-toast/provider/pulse-toast.service';
import { TokenOtpProvider } from '../../../../../../providers/token-otp/token-otp/token-otp';

@NgModule({
  declarations: [
    ActivationBandPage
  ],
  providers: [
    PulseToastService,
    TokenOtpProvider
  ],
  imports: [
    IonicPageModule.forChild(ActivationBandPage),
    FlowHeaderComponentModule,
    CustomerSecurityDelegateModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ChangeKeysPageModule {
}
