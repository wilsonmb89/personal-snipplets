import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardCampaignComponentsModule } from '@app/shared/components/campaigns/cards-campaign/components/card-campaign-components.module';
import { EnrollingPage } from '@app/shared/components/campaigns/cards-campaign/pages/enrolling/enrolling';
import { CardsCampaignModalManagerProvider } from '@app/shared/components/campaigns/cards-campaign/services/cards-campaign-modal-manager.service';

@NgModule({
  declarations: [
    EnrollingPage,
  ],
  imports: [
    IonicPageModule.forChild(EnrollingPage),
    CardCampaignComponentsModule
  ],
  providers: [
    CardsCampaignModalManagerProvider
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class EnrollingModule {}
