import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnicefLandingPage } from './unicef-landing';
import { CardsCampaignModalManagerProvider } from '@app/shared/components/campaigns/cards-campaign/services/cards-campaign-modal-manager.service';
import { CardCampaignComponentsModule } from '@app/shared/components/campaigns/cards-campaign/components/card-campaign-components.module';

@NgModule({
  declarations: [
    UnicefLandingPage,
  ],
  imports: [
    IonicPageModule.forChild(UnicefLandingPage),
    CardCampaignComponentsModule,
  ],
  providers: [
    CardsCampaignModalManagerProvider
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class UnicefLandingPageModule {}
