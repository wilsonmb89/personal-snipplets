import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { CompanyAval } from 'app/models/company-aval';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';
import { PageTrack } from '../../../app/core/decorators/AnalyticTrack';
import { ProductDetail } from '../../../app/models/products/product-model';
import { SessionProvider } from '../../../providers/authenticator/session';
import { AvalOpsProvider } from '../../../providers/aval-ops/aval-ops';
import { CardsMapperProvider, PCardModel } from '../../../providers/cards-mapper/cards-mapper';
import { BdbConstants } from '../../../app/models/bdb-generics/bdb-constants';
import { BdbMaskProvider } from '../../../providers/bdb-mask/bdb-mask';
import { MaskType } from '../../../providers/bdb-mask/bdb-mask-type.enum';

@PageTrack({ title: 'page-summary-aval' })
@IonicPage()
@Component({
  selector: 'page-summary-aval',
  templateUrl: 'summary-aval.html',
})
export class SummaryAvalPage {

  @ViewChild(Content) content: Content;

  productsCompany: Array<PCardModel> = [];
  isMobile: boolean;
  company: CompanyAval;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private bdbPlatforms: BdbPlatformsProvider,
    private avalOps: AvalOpsProvider,
    private cardMapper: CardsMapperProvider,
    private bdbMask: BdbMaskProvider
  ) {
    this.isMobile = this.bdbPlatforms.isMobile() || this.bdbPlatforms.isTablet();
  }

  ionViewDidLoad() {
    this.company = this.navParams.get('company');
    const array = this.navParams.get('products');
    this.productsCompany = array.map((e: ProductDetail) => {
      const card = this.cardMapper.mapToPCard(e);
      if (card.product.productType === BdbConstants.PUNTOS_POR_TODO) {
        card.pBalance.key = 'Tus puntos';
        card.pBalance.value = this.bdbMask.maskToDecimal(e.amount.toString());
      } else if (card.product.productType === BdbConstants.GERENTE_BANCA_PREFERENTE) {
        card.pBalance.key = 'Teléfono';
        card.pNumber = null;
        card.pBalance.value = this.bdbMask.convertToPhone(e.amount.toString());
      } else {
        card.pBalance.value = this.bdbMask.maskFormatFactory(e.amount, MaskType.CURRENCY);
      }
      if (card.pBalance.key === 'UNKNOWN' || card.pBalance.key === 'Unknown') {
        card.pBalance.key = 'Sin información';
        card.showBalanceLoader = false;
        card.pBalance.value = '---';
      }


      card.pNumber = (!!card.pNumber) ? this.bdbMask.getMaskValue(card.pNumber) : null;

      return card;
    });
  }

  public clickDetails(account: PCardModel) {  }

  back() {
    this.navCtrl.pop();
  }

  logout() {
    this.navCtrl.push('authentication/logout');
  }

}
