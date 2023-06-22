import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { LoginModule } from '../../login.module';
import { InitializeAppDelegateModule } from '../../../../core/services-delegate/initialize-app/initialize-app-delegate.module';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import {BdbAuthenticationModule} from '@app/modules/authentication/authentication.module';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    LoginModule,
    InitializeAppDelegateModule,
    BdbUtilsModule,
    BdbAuthenticationModule
  ]
})
export class LoginPageModule {}
