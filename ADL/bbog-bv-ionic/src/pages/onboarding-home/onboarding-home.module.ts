import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnboardingHomePage } from './onboarding-home';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    OnboardingHomePage,
  ],
  imports: [
    IonicPageModule.forChild(OnboardingHomePage),
    DirectivesModule
  ],
})
export class OnboardingHomePageModule { }
