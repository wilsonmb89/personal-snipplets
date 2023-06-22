import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import {BdbInMemoryProvider} from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import {InMemoryKeys} from '../../../../providers/storage/in-memory.keys';
import {BdbMaskProvider, MaskType} from '../../../../providers/bdb-mask';
import {ProductDetail} from '../../../../app/models/products/product-model';
import {BdbConstants} from '../../../../app/models/bdb-generics/bdb-constants';

@IonicPage()
@Component({
  selector: 'page-references-select-account',
  templateUrl: 'references-select-account.html',
})
export class ReferencesSelectAccountPage implements OnInit {

  alldAccounts = [];
  title = `<span class="references-select-account-container__title__bold">Selecciona el producto</span>
            para la referencia: </br>`;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbMaskProvider: BdbMaskProvider,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts(): void {

    const customerProducts: ProductDetail[] = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);

    if (!!customerProducts) {

      this.alldAccounts = customerProducts.filter((product: ProductDetail) =>
        product.category === 'AC' || product.category === 'TC' || product.category === 'CR'
      ).map((product: ProductDetail) => {

        const date = new Date(product.openDt);
        product.openDt = this.datePipe.transform(date, 'yyyy-MM-ddThh:mm:ssZZZZZ');

        return {
          logoPath: BdbConstants.BBOG_LOGO_WHITE,
          contraction: '',
          cardTitle: product.productName,
          cardDesc: [
            `No. ${product.productNumber}`
          ],
          cardSubDesc: [
            `Saldo: ${this.bdbMaskProvider.maskFormatFactory(product.amount, MaskType.CURRENCY)}`
          ],
          account: product,
          avatarColor: '',
          showLogo: true,
          withFavoriteStar: false,
          favorite: false,
          favoriteTime: undefined
        };
      });
    }
  }

  selectAccount(account: ProductDetail): void {
    this.bdbInMemory.setItemByKey(InMemoryKeys.AcctBankReference, account);
    this.navCtrl.push('ReferencesGeneratePage', {}, {
      animate: true,
      direction: 'forward'
    });
  }

}
