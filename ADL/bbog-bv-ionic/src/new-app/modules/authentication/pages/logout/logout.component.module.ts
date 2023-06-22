import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BdbAuthenticationLogoutComponent } from './logout.component';

@NgModule({
  declarations: [BdbAuthenticationLogoutComponent],
  imports: [
    IonicPageModule.forChild(BdbAuthenticationLogoutComponent),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BdbAuthenticationLogoutComponentModule {}
