import {Component, OnInit} from '@angular/core';
import {Events, IonicPage, NavController} from 'ionic-angular';
import {CustomerInfoModel} from '@npm-bbta/bdb-adn';
import {ProductDetail} from '../../app/models/products/product-model';
import {BdbInMemoryProvider} from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import {InMemoryKeys} from '../../providers/storage/in-memory.keys';
import {BdbConstants} from '../../app/models/bdb-generics/bdb-constants';

@IonicPage()
@Component({
  selector: 'page-adn',
  templateUrl: 'adn.html',
})
export class AdnPage implements OnInit {

  customer: CustomerInfoModel;
  product: ProductDetail = this.bdbInMemory.getItemByKey(InMemoryKeys.ProductDetail);
  accountType = BdbConstants.SAVINGS_ACCOUNT;
  userIp;

  constructor(private navCtrl: NavController,
              private bdbInMemory: BdbInMemoryProvider,
              private events: Events) {
  }

  ngOnInit() {
    const product: ProductDetail = this.bdbInMemory.getItemByKey(InMemoryKeys.ProductDetail);

    if (product.productType === BdbConstants.ATH_CHECK_ACCOUNT) {
      this.accountType = BdbConstants.CHECK_ACCOUNT;
    }

    this.customer = {
      identityType: this.bdbInMemory.getItemByKey(InMemoryKeys.IdentificationType),
      identityNumber: this.bdbInMemory.getItemByKey(InMemoryKeys.IdentificationNumber),
      accountNumber: product.productNumber,
      firstName: '',
      lastName: '',
      middleName: '',
      secondLastName: '',
      cityResidenceName: '',
      branchId: '',
      cityExpeditionName: '',
      accountType: this.accountType,
      authUuid: this.bdbInMemory.getItemByKey(InMemoryKeys.UUID)
    };

    this.userIp = this.bdbInMemory.getItemByKey(InMemoryKeys.IP);
  }

  ionViewWillEnter() {
    this.events.publish('srink', true);
  }

  clickBack() {
    this.navCtrl.setRoot('DetailAndTxhistoryPage');
  }

  clickExit() {
    this.bdbInMemory.clearItem(InMemoryKeys.CustomerProductList);
    this.navCtrl.setRoot('DashboardPage');
  }

  clickProducts() {
    this.bdbInMemory.clearItem(InMemoryKeys.CustomerProductList);
    this.navCtrl.setRoot('DashboardPage');
  }
}

