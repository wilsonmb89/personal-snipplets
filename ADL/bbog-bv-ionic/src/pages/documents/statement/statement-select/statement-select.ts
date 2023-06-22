import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';

@PageTrack({ title: 'statement-select' })
@IonicPage()
@Component({
  selector: 'page-statement-select',
  templateUrl: 'statement-select.html',
})
export class StatementSelectPage implements OnInit {

  productCardsActive = [];
  productCardsInActive = [];
  dateList = [];
  private showProdsLoader = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbUtils: BdbUtilsProvider,
  ) {
  }

  ionViewDidLoad() { }

  ngOnInit() {
    const customerProductsActive: ProductDetail[] = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    const customerProductsInActive: ProductDetail[] = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductListInActive);

    this.productCardsActive = !!customerProductsActive ? this.mapProducts(customerProductsActive) : [];
    this.productCardsInActive = !!customerProductsInActive ? this.mapProducts(customerProductsInActive) : [];

  }

  mapProducts(customerProducts: ProductDetail[]) {
    return customerProducts
      .filter(e => e.category !== 'FD' || e.productType !== 'FB')
      .map((f: ProductDetail) => {
        const logoPath = f.category === BdbConstants.TARJETA_CREDITO_BBOG
          ? this.bdbUtils.getImageUrl(f.productType)
          : BdbConstants.BBOG_LOGO_WHITE;
        return {
          title: f.productName,
          subDesc: [
            f.productBank
          ],
          desc: [
            `No. ${f.productNumber}`
          ],
          product: f,
          details: [],
          showLogo: true,
          logoPath,
        };
      });
  }

  onItemClick(item) {
    this.bdbInMemory.setItemByKey(InMemoryKeys.ProductDetail, item.product);
    this.navCtrl.push('StatementDownloadPage');
  }

}
