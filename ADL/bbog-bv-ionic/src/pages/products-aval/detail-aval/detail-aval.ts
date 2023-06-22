import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PageTrack } from '../../../app/core/decorators/AnalyticTrack';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';
import { CompanyAval } from '../../../app/models/company-aval';
import { AccountBalance } from '../../../app/models/enrolled-transfer/account-balance';
import { GetBalancesByAccountRs } from '../../../providers/aval-ops/aval-ops-models';
import { PCardModel } from '../../../providers/cards-mapper/cards-mapper';

@PageTrack({ title: 'page-detail-aval' })
@IonicPage()
@Component({
  selector: 'page-detail-aval',
  templateUrl: 'detail-aval.html',
})
export class DetailAvalPage {

  company: CompanyAval;
  isMobile: boolean;
  account: AccountBalance;
  item: PCardModel;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbPlatforms: BdbPlatformsProvider
  ) {
    this.isMobile = this.bdbPlatforms.isMobile() || this.bdbPlatforms.isTablet();
    this.company = this.navParams.get('company');
    this.item = this.navParams.get('item');
  }

  ionViewWillEnter() {
  }

  back() {
    this.navCtrl.pop();
  }
}
