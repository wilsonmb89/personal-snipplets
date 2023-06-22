import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PbLandingPage } from './pb-landing';
import { DirectivesModule } from '../../directives/directives.module';
import { InitializeAppDelegateModule } from '../../new-app/core/services-delegate/initialize-app/initialize-app-delegate.module';

@NgModule({
  declarations: [
    PbLandingPage,
  ],
  imports: [
    IonicPageModule.forChild(PbLandingPage),
    DirectivesModule,
    InitializeAppDelegateModule
  ],
})
export class PbLandingPageModule {}
