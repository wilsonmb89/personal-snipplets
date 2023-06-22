import { Injectable } from '@angular/core';
import { map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DashboardCampaing } from '../models/dashboard-campaigns.model';
import { UserFeatures } from '../../../../new-app/core/services-apis/user-features/models/UserFeatures';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';

@Injectable()
export class DashboardBannerCampaignsService {

    private readonly CONST_MAX_AMT_UNICEF = 9;
    private readonly CONST_MAX_AMT_MILLION_BANQUET = 1;
    private readonly CONST_EXPIRATION_DATE_UNICEF = new Date(2021, 3, 5);
    private readonly CONST_EXPIRATION_MILLION_BANQUET = new Date(2021, 3, 5);

    constructor(
        private userFacade: UserFacade,
    ) { }

    private setNewAmtCampaignsDash(amtUnicef: number,  amtMillionBanquet: number): void {
        if (amtUnicef <= this.CONST_MAX_AMT_UNICEF || amtMillionBanquet <= this.CONST_MAX_AMT_MILLION_BANQUET) {
            this.userFacade.userFeatures$
                .pipe(take(1))
                .subscribe((userFeatures: UserFeatures) => {
                    userFeatures.settings.amtUnicefCampaignDash = amtUnicef <= this.CONST_MAX_AMT_UNICEF ? (amtUnicef + 1) : amtUnicef;
                    userFeatures.settings.amtMillionBanquetCampaignDash =
                        amtMillionBanquet <= this.CONST_MAX_AMT_MILLION_BANQUET ? (amtMillionBanquet + 1) : amtMillionBanquet;
                    this.userFacade.updateUserFeaturesData(userFeatures);
                });
        }
    }

    // TODO: Add implementation here if a new campaign was created
    private syncAmtCampaigns(amtMillionBanquet: number, amtUnicef: number): {amtMillionBanquet: number, amtUnicef: number} {

        if (amtUnicef <= this.CONST_MAX_AMT_UNICEF
                && amtMillionBanquet <= this.CONST_MAX_AMT_MILLION_BANQUET
                && !((amtMillionBanquet % 2 === 0 && amtUnicef % 2 === 0) ||
                (amtMillionBanquet % 2 !== 0 && amtUnicef % 2 !== 0))) {
            amtMillionBanquet = amtMillionBanquet % 2 === 0 ? amtMillionBanquet : (amtMillionBanquet - 1);
            amtUnicef = amtUnicef % 2 === 0 ? amtUnicef : (amtUnicef - 1);
        }
        return { amtMillionBanquet, amtUnicef };
    }

    public getCampaignDash(dashCampaigns: DashboardCampaing): Observable<DashboardCampaing> {
        if (!dashCampaigns) {
            return this.userFacade.userFeatures$
                .pipe(
                    take(1),
                    map((userFeatures: UserFeatures) => {
                        const unicefCardRequested = userFeatures.settings.unicefCardRequested;
                        const { amtMillionBanquet, amtUnicef } =
                            this.syncAmtCampaigns(
                                userFeatures.settings.amtMillionBanquetCampaignDash,
                                userFeatures.settings.amtUnicefCampaignDash
                            );
                        return { amtMillionBanquet, amtUnicef, unicefCardRequested };
                    }),
                    tap(({ amtMillionBanquet, amtUnicef }) => {
                        this.setNewAmtCampaignsDash(amtUnicef, amtMillionBanquet);
                    }),
                    map(({ amtMillionBanquet, amtUnicef, unicefCardRequested }) => {
                        const campaing = new DashboardCampaing();
                        const date = new Date();

                      if (date < this.CONST_EXPIRATION_DATE_UNICEF &&
                        !unicefCardRequested && amtUnicef <= this.CONST_MAX_AMT_UNICEF && amtUnicef % 2 === 0) {
                        campaing.campaignCode = 1;
                        campaing.amt = amtUnicef;
                      } else if (date < this.CONST_EXPIRATION_MILLION_BANQUET &&
                        amtMillionBanquet % 2 !== 0 &&
                        amtMillionBanquet <= this.CONST_MAX_AMT_MILLION_BANQUET) {
                        campaing.campaignCode = 2;
                        campaing.amt = amtMillionBanquet;
                      }
                        return campaing;
                    })
                );
        }
        return of(new DashboardCampaing());
    }

}
