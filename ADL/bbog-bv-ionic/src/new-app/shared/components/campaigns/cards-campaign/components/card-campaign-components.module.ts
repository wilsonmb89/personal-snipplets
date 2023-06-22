import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlowHeaderNavigationComponent } from '@app/shared/components/campaigns/cards-campaign/components/flow-header-navigation/flow-header-navigation';
import { CommonModule } from '@angular/common';
import { UnicefTycCardModal } from '@app/shared/components/campaigns/cards-campaign/components/terminos-card-modal/unicef/unicef-tyc-card-modal';
import { TycCardTemplate } from '@app/shared/components/campaigns/cards-campaign/components/terminos-card-modal/tyc-card-template';
import { GreenCardTycModal } from '@app/shared/components/campaigns/cards-campaign/components/terminos-card-modal/greenCard/green-card-tyc-modal';
import { UpdateUserDataModalComponent } from '@app/shared/components/campaigns/cards-campaign/components/update-user-data-modal/update-user-data-modal';
import { ErrorCardRequestModalComponent } from '@app/shared/components/campaigns/cards-campaign/components/error-card-request-modal/error-card-request-modal';
import { CardsCampaignModalManagerProvider } from '@app/shared/components/campaigns/cards-campaign/services/cards-campaign-modal-manager.service';
import { ErrorCardInProgressModal } from '@app/shared/components/campaigns/cards-campaign/components/error-card-in-progress-modal/error-card-in-progress-modal';
import { ErrorClientHasACardModal } from '@app/shared/components/campaigns/cards-campaign/components/error-client-has-a-card-modal/error-client-has-a-card-modal';


@NgModule({
  declarations: [
    TycCardTemplate,
    FlowHeaderNavigationComponent,
    UnicefTycCardModal,
    GreenCardTycModal,
    UpdateUserDataModalComponent,
    ErrorCardRequestModalComponent,
    ErrorCardInProgressModal,
    ErrorClientHasACardModal
  ],
  exports: [
    TycCardTemplate,
    FlowHeaderNavigationComponent,
    UnicefTycCardModal,
    GreenCardTycModal,
    UpdateUserDataModalComponent,
    ErrorCardRequestModalComponent,
    ErrorCardInProgressModal,
    ErrorClientHasACardModal
  ],
  entryComponents: [
    UnicefTycCardModal,
    GreenCardTycModal,
    UpdateUserDataModalComponent,
    ErrorCardRequestModalComponent,
    ErrorCardInProgressModal,
    ErrorClientHasACardModal
  ],
  providers: [CardsCampaignModalManagerProvider],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    CommonModule
  ]

})
export class CardCampaignComponentsModule {
}
