import { NgModule } from '@angular/core';
import {BdbLogoutService} from '@app/modules/authentication/services/logout/logout.service';
import {AuthenticatorServiceApi} from '@app/modules/authentication/services/auth/authenticator.service';
import {AuthenticatorApiServiceModule} from '@app/apis/authenticator/authenticator.module';

@NgModule({
  imports: [ AuthenticatorApiServiceModule],
  providers: [BdbLogoutService, AuthenticatorServiceApi],
})
export class BdbAuthenticationServicesModule {}
