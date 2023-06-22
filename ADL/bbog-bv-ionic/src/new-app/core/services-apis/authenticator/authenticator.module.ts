import {NgModule} from '@angular/core';
import {BdbHttpModule} from '../../http/bdb-http.module';
import {AuthenticatorApiService} from '@app/apis/authenticator/authenticator';

@NgModule({
  declarations: [],
  imports: [
    BdbHttpModule
  ],
  providers: [
    AuthenticatorApiService
  ]
})
export class AuthenticatorApiServiceModule {}
