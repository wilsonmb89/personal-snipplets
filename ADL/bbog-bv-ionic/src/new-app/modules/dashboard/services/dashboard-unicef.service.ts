import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, take, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { UserFacade } from '../../../shared/store/user/facades/user.facade';
import { UserFeatures } from '../../../core/services-apis/user-features/models/UserFeatures';

@Injectable()
export class DashboardUnicefService {

    constructor(
        private userFacade: UserFacade
    ) { }

    private setNewAmtUnicefCampaignDash(amt: number): void {
        if (amt <= 8) {
            this.userFacade.userFeatures$
            .pipe(take(1))
            .subscribe((userFeatures: UserFeatures) => {
                userFeatures.settings.amtUnicefCampaignDash = amt + 1;
                this.userFacade.updateUserFeaturesData(userFeatures);
            });
        }
    }

    public getAmtUnicefCampaignDash(amtUnicefCampaign: null | number): Observable<{ amt: number, showModal: boolean }> {
        if (amtUnicefCampaign === null) {
            return this.userFacade.userFeatures$
                .pipe(
                    take(1),
                    map((userFeatures: UserFeatures) => ({
                        amtUnicefCampaignDash: userFeatures.settings.amtUnicefCampaignDash,
                        unicefCardRequested: userFeatures.settings.unicefCardRequested
                    })),
                    tap(({ amtUnicefCampaignDash, unicefCardRequested }) => {
                        if (!unicefCardRequested) {
                            this.setNewAmtUnicefCampaignDash(amtUnicefCampaignDash);
                        }
                    }),
                    map(({ amtUnicefCampaignDash, unicefCardRequested }) =>
                        ({
                            amt: amtUnicefCampaignDash,
                            showModal: unicefCardRequested ? false : amtUnicefCampaignDash % 2 === 0
                        })
                    )
                );
        }

        return of({ amt: amtUnicefCampaign, showModal: false });
    }

}
