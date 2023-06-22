import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CampaignDashUnicefComponent } from './components/modals/campaign-dash-modal/campaign-dash-unicef';
import { PulseModalControllerProvider } from '../../../providers/pulse-modal-controller/pulse-modal-controller';
import { DashboardBannerCampaignsService } from './services/dashboard-banner-campaigns.service';
import { DashboardCardActivationService } from './services/dashboard-card-activation.service';
import { CampaignMillionBanquetComponent } from './components/modals/million-banquet-modal/million-banquet-modal';
@NgModule({
    declarations: [
        CampaignDashUnicefComponent,
        CampaignMillionBanquetComponent
    ],
    providers: [
        PulseModalControllerProvider,
        DashboardBannerCampaignsService,
        DashboardCardActivationService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [
        CampaignDashUnicefComponent,
        CampaignMillionBanquetComponent
    ]
})
export class DashboardModule { }
