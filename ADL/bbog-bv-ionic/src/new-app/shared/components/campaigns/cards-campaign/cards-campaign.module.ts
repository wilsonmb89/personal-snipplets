import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsCampaign } from '@app/shared/components/campaigns/cards-campaign/cards-campaign';
import { CardCampaignItem } from '@app/shared/components/campaigns/cards-campaign/card-item/card-campaign-item';
import { GreenCardLandingModule } from '@app/shared/components/campaigns/cards-campaign/pages/green-card/green-card-landing/green-card-landing.module';
import { UnicefLandingPageModule } from '@app/shared/components/campaigns/cards-campaign/pages/unicef/unicef-landing/unicef-landing.module';
import { EnrollingModule } from '@app/shared/components/campaigns/cards-campaign/pages/enrolling/enrolling.module';

@NgModule({
  declarations: [
    CardsCampaign,
    CardCampaignItem,
  ],
  exports: [
    CardsCampaign,
    CardCampaignItem
  ],
  imports: [
    CommonModule,
    EnrollingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class CardsCampaignModule {}
