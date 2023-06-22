import {Component, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {BdbConstants} from '../../../../../../../app/models/bdb-generics/bdb-constants';
import {NavigationProvider} from '../../../../../../../providers/navigation/navigation';
import {SelectAccountHandlerProvider} from '../../../../../../../providers/select-account-handler/select-account-handler';
import {ProductDetail} from '../../../../../../../app/models/products/product-model';
import {FunnelKeysProvider} from '../../../../../../../providers/funnel-keys/funnel-keys';
import {FunnelEventsProvider} from '../../../../../../../providers/funnel-events/funnel-events';
import {PocketCreateRq, AccountDetailApi, Pocket} from '../../../models/pocket';
import {BdbInMemoryProvider} from '../../../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import {InMemoryKeys} from '../../../../../../../providers/storage/in-memory.keys';
import {BdbUtilsProvider} from '../../../../../../../providers/bdb-utils/bdb-utils';
import {BdbModalProvider} from '../../../../../../../providers/bdb-modal/bdb-modal';
import * as pocketTypes from '../../../services/pocket-types.json';
import {PocketExceedMaxComponent} from '../../../components/pocket-exceed-max/pocket-exceed-max';
import {PulseModalControllerProvider} from '../../../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import {PocketSameCategoryComponent} from '../../../components/pocket-same-category/pocket-same-category';

@IonicPage()
@Component({
  selector: 'page-pocket-account',
  templateUrl: 'pocket-account.html',
})
export class PocketAccountPage {
  _funnel: any;

  abandonText = BdbConstants.ABANDON_GENERIC;
  title = 'Vincula tu alcancía';
  navTitle = 'Alcancías';
  subtitle = 'Selecciona la cuenta que estará asociada para realizar transacciones con tu alcancía';
  enable = false;
  accounts: Array<ProductDetail>;
  items: Array<{ cardTitle, cardLabel, cardValue, isActive, acct }> = [];
  accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct };
  tyc = false;
  public tempPocketList: { [key: string]: Pocket[] };
  pocketTypes: { id: string, name: string }[] = pocketTypes as any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private navigation: NavigationProvider,
              public selectAccountHandler: SelectAccountHandlerProvider,
              private funnelKeysProvider: FunnelKeysProvider,
              private funnelEventsProvider: FunnelEventsProvider,
              private bdbInMemory: BdbInMemoryProvider,
              private bdbUtils: BdbUtilsProvider,
              private bdbModal: BdbModalProvider,
              private pulseModalCtrl: PulseModalControllerProvider,
              private viewRef: ViewContainerRef,
              private resolver: ComponentFactoryResolver
  ) {
    this._funnel = this.funnelKeysProvider.getKeys().pocket;
  }

  ionViewDidLoad() {
    this.accountsToShow();
  }

  accountsToShow() {
    this.accounts = this.selectAccountHandler.getAccountsByType(false, [BdbConstants.ATH_SAVINGS_ACCOUNT]);
    this.items = this.selectAccountHandler.getCardsMapping(this.accounts);
    const mAccount: ProductDetail = this.selectAccountHandler.setFirstAccountSelection(this.accounts, this._funnel);
    if (mAccount !== null) {
      const acctOriginSelect = this.items.filter((e: { cardTitle, cardLabel, cardValue, isActive, acct: ProductDetail }) => {
        return e.acct.productNumber === mAccount.productNumber;
      });
      if (acctOriginSelect) {
        this.accountSeleted = acctOriginSelect.shift();
      }
      this.enable = true;

    }
  }

  submit() {
    const accountDetail: AccountDetailApi = new AccountDetailApi();
    accountDetail.acctId = this.accountSeleted.acct.productNumber;
    accountDetail.acctType = this.bdbUtils.mapTypeProduct(this.accountSeleted.acct.productType);
    const pocketRq: PocketCreateRq = new PocketCreateRq();
    pocketRq.accountDetail = accountDetail;
    pocketRq.pocketDetail = this.bdbInMemory.getItemByKey(InMemoryKeys.PocketDetail);
    if (this.validatePocketTypes(this.accountSeleted.acct.productNumberApi, pocketRq)) {
      this.bdbInMemory.setItemByKey(InMemoryKeys.PocketCreateRq, pocketRq);
      this.navCtrl.push('PocketBuildingPage');
    }
  }

  private validatePocketTypes(accountId: String, dataRq: PocketCreateRq) {
    this.tempPocketList = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerPocketList);
    if (!!this.tempPocketList) {
      const pocketsByAccount: Pocket[] = this.tempPocketList[`${accountId}`];
      if (!!pocketsByAccount) {
        if (pocketsByAccount.length >= 5) {
          this.showErrorModal(true);
          return false;
        }
        const pocket = pocketsByAccount.find(p => p.pocketType !== '999' && p.pocketType === dataRq.pocketDetail.pocketType);
        if (!!pocket) {
          this.bdbInMemory.setItemByKey(InMemoryKeys.RepeatedPocket, this.getNamePocketType(dataRq.pocketDetail.pocketType));
          this.showErrorModal(false);
          return false;
        }
      }
    }
    return true;
  }


  private getNamePocketType(id: string): string {
    const pocketTypeById = this.pocketTypes.find((value: { id: string, name: string }) => value.id === id);
    return (!!pocketTypeById) ? pocketTypeById.name : '';
  }

  accountSelected(item) {
    this.enable = true;
    this.items.forEach((e) => {
      e.isActive = false;
    });
    item.isActive = true;
    this.selectAccountHandler.updateSelectedAccount(item.acct, this._funnel);
    this.accountSeleted = item;
  }

  showTyC() {
    // this.bdbModal.launchTerminosModal('titulo', 'menssage');
    this.bdbModal.launchModal('TycModalPage', 'modal-large');
  }

  acceptTyC(isChecked) {
    this.tyc = isChecked.detail;
  }


  onAbandonPressed() {
    this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.account);
    this.navigation.abandonTransaction(this.navCtrl);
  }

  onBackPressed() {
    this.navCtrl.pop();
  }

  private async showErrorModal(flag: boolean): Promise<void> {
    const modal = await this.pulseModalCtrl.create({
      component: flag ? PocketExceedMaxComponent : PocketSameCategoryComponent,
      componentProps: {}
    }, this.viewRef, this.resolver);
    await modal.present();
  }

}
