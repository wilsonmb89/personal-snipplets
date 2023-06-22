import { Injectable } from '@angular/core';
import { LoadingController, AlertController, NavController, Events } from 'ionic-angular';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { BdbPlatformsProvider } from '../bdb-platforms/bdb-platforms';
import { NavigationProvider } from '../navigation/navigation';
import { FunnelEventsProvider } from '../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../providers/funnel-keys/funnel-keys';
import { TsErrorProvider } from '../ts-error/ts-error-provider';
import { BdbModalProvider } from '../bdb-modal/bdb-modal';
import { ProductDetail } from '../../app/models/products/product-model';
import { AvalOpsProvider } from '../aval-ops/aval-ops';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';

@Injectable()
export class ProductsBalancesProvider {

  errorMsg: string;
  private _products;

  constructor(
    private loadingCtrl: LoadingController,
    private bdbInMemoryProvider: BdbInMemoryProvider,
    private alertCtrl: AlertController,
    private events: Events,
    private bdbPlatforms: BdbPlatformsProvider,
    private navigation: NavigationProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private tsErrorProvider: TsErrorProvider,
    private bdbModal: BdbModalProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private avalOps: AvalOpsProvider
  ) {

    this._products = this.funnelKeysProvider.getKeys().products;
  }

  getProductsRedirectRecharge(navCtrl) {
    const loading = this.loadingCtrl.create();
    loading.present().then(() => {
      this.avalOps.getAccountListByBank()
        .subscribe(
          (data: ProductDetail[]) => {
            const acctBalancesList = data;
            this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.CustomerProductList, acctBalancesList);
            navCtrl.setRoot('MasterPage', {
              'page': 'PaymentsMainPage',
              'option': 'recharge'
            });
            loading.dismiss();
          },
          (err) => {
            if (err.status === 409) {
              this.tsErrorProvider.launchErrorModal(err.error._error);
            }
          }
        );
    });
  }
}
