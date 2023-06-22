import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserFeaturesDelegateService } from '@app/delegate/user-features/user-features-delegate.service';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { DirectivesModule } from '../../../../../../../directives/directives.module';
import { PocketOnboardingPage } from './pocket-onboarding';


@NgModule({
  declarations: [
    PocketOnboardingPage,
  ],
  imports: [
    IonicPageModule.forChild(PocketOnboardingPage),
    ComponentsModule,
    DirectivesModule
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PocketOnboardingPageModule {}
