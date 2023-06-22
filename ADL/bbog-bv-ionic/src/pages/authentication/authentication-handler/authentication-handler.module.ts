import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthenticationHandlerPage } from './authentication-handler';

@NgModule({
  declarations: [
    AuthenticationHandlerPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthenticationHandlerPage),
  ],
})
export class AuthenticationHandlerPageModule {}
