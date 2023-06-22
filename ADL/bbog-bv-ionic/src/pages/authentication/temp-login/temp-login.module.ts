import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TempLoginPage } from './temp-login';
import { DirectivesModule } from '../../../directives/directives.module';
import { ComponentsModule } from '../../../components/components.module';
import { ValidateTokenComponent } from '../../../components/token-otp/validate-token/validate-token';

@NgModule({
  declarations: [
    TempLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(TempLoginPage),
    ComponentsModule,
    DirectivesModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    ValidateTokenComponent
  ]
})
export class TempLoginPageModule {}
