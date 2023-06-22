import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GreenCardLandingPage } from '@app/shared/components/campaigns/cards-campaign/pages/green-card/green-card-landing/green-card-landing';
import { CardsCampaignModalManagerProvider } from '@app/shared/components/campaigns/cards-campaign/services/cards-campaign-modal-manager.service';
import { CardCampaignComponentsModule } from '@app/shared/components/campaigns/cards-campaign/components/card-campaign-components.module';

@NgModule({
  declarations: [
    GreenCardLandingPage
  ],
  imports: [
    IonicPageModule.forChild(GreenCardLandingPage),
    CardCampaignComponentsModule
  ],
  providers: [
    CardsCampaignModalManagerProvider
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class GreenCardLandingModule {}
