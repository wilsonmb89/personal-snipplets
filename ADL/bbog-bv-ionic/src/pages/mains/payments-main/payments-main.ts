import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { BdbConstants, BalanceStatus } from '../../../app/models/bdb-generics/bdb-constants';
import { ProductDetail } from '../../../app/models/products/product-model';
import { CrossSellProvider } from '../../../components/cross-sell';
import { DefaultViewMenuComponent } from '../../../components/default-view-menu/default-view-menu';
import { HistoryPage } from '../../../pages/payments/history/history';
import { SessionProvider } from '../../../providers/authenticator/session';
import { AvalOpsProvider } from '../../../providers/aval-ops/aval-ops';
import { BdbToastProvider } from '../../../providers/bdb-toast/bdb-toast';
import { FilterUtilsProvider } from '../../../providers/filter-utils/filter-utils';
import { FunnelEventsProvider } from '../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../providers/navigation/navigation';
import { PaymentsMainProvider } from '../../../providers/payments-main/payments-main';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { TabsMenuProvider } from '../../../providers/tabs-menu/tabs-menu';
import { UnknownBalanceProvider } from '../../../providers/unknown-balance/unknown-balance';
import { MobileSummaryProvider } from '../../../components/mobile-summary';
import { ProgressBarProvider } from '../../../providers/progress-bar/progress-bar';
import { PageTrack } from '../../../app/core/decorators/AnalyticTrack';

@PageTrack({ title: 'payments-menu' })
@IonicPage({
  segment: 'payments-main'
})
@Component({
  selector: 'page-payments-main',
  templateUrl: 'payments-main.html',
})
export class PaymentsMainPage implements OnInit {

  public tabs = [];
  hideSpinner = false;
  accounts: Array<ProductDetail> = [];
  public payCenterLink = false;
  @ViewChild('target', { read: ViewContainerRef }) target;
  private _menu = this.funnelKeysProvider.getKeys().menu;
  private pathEmptyStates = BdbConstants.DIR_EMPTY_STATE;
  navTitle = 'Pagos';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nav: NavigationProvider,
    private payMainProvider: PaymentsMainProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private tabsMenuProvider: TabsMenuProvider,
    private componentFactoryResolver: ComponentFactoryResolver,
    private events: Events,
    private avalOps: AvalOpsProvider,
    private filterUtils: FilterUtilsProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbToast: BdbToastProvider,
    private crossSellProvider: CrossSellProvider,
    private unknownBalance: UnknownBalanceProvider,
    private mobileSummary: MobileSummaryProvider,
    private progressBar: ProgressBarProvider,
    private viewRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this._menu = this.funnelKeysProvider.getKeys().menu;
    this.tabs = this.payMainProvider.tabsData(
      this.navCtrl,
      this.viewRef,
      this.componentFactoryResolver
    );

    const tab = this.navParams.get('tab');
    const mTab = this.tabs.find(e => e.segment === tab);
    this.validateProds(!!mTab ? mTab : this.tabs[1]);
  }

  ionViewWillEnter() {
    this.funnelEventsProvider.callFunnel(this._menu, this._menu.steps.payments);
    this.progressBar.resetObject();
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Servicio');
    this.mobileSummary.reset();
    this.events.publish('menu:active', 'PaymentsMainPage');
    this.events.publish('srink', false);
  }

  validateProds(tab) {
    const customerProducts = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    if (!!customerProducts) {
      this.mapFilters(customerProducts);
      this.mapTabs(tab);
      this.events.publish('menu:products', true);
      this.loadCheckAccounts(customerProducts);
    } else {
      this.events.publish('menu:products', false);
      this.hideSpinner = false;
      this.avalOps.getAccountListByBank().subscribe(
        (newCustomerProducts: ProductDetail[]) => {
          this.mapFilters(newCustomerProducts);
          this.mapTabs(tab);
          this.events.publish('menu:products', true);
          this.loadCheckAccounts(newCustomerProducts);
        },
        (err) => {
          this.hideSpinner = true;
          this.bdbToast.showToastAction(
            'Error consultando los productos', 'Reintentar',
            () => {
              this.validateProds(tab);
            });
        }
      );
    }
  }

  loadCheckAccounts(customerProducts: ProductDetail[]) {
    const checkAccounts = customerProducts.filter(e => {
      return e.productType === BdbConstants.ATH_CHECK_ACCOUNT;
    });
    this.unknownBalance.loadAccountBalances(checkAccounts, (balanceStatus) => {
      if (balanceStatus === BalanceStatus.FINISHED) {
        this.whenProcessFinish(customerProducts);
      } else if (balanceStatus === BalanceStatus.FINISHED_WITH_ERROR) {
        this.whenProcessFinish(customerProducts);
        this.bdbToast.showToastGeneric({
        message: 'Algunas de tus cuentas no pudieron ser consultadas',
        close: true,
        color: 'toast-error',
        type: 'delete'
      });
      }
    });
  }

  whenProcessFinish(customerProducts: ProductDetail[]) {
    this.bdbInMemory.setItemByKey(InMemoryKeys.CustomerProductList, customerProducts);
    this.hideSpinner = true;
  }

  mapFilters(customerProducts) {
    this.accounts = customerProducts.filter(this.filterUtils.getValidAccountsToPay());

  }

  changeTab(tab) {
    this.mapTabs(tab);
  }

  mapTabs(tab) {
    tab.active = true;
    this.payCenterLink = false;
    if (!!this.accounts && this.accounts.length === 0) {
      if (tab.empty.message === 'avalPay') {
        tab.component = DefaultViewMenuComponent;
        this.payCenterLink = true;
        tab.empty = {
          img: { desktop: this.pathEmptyStates + 'noaccount.svg', mobile: this.pathEmptyStates + 'noaccount.svg' },
          message: 'Abre una cuenta de ahorros, o realiza tus pagos por PSE en AVAL Pay Center.',
          button: {
            message: 'Abrir una cuenta',
            callback: () => {
              this.crossSellProvider.handleDispatcher(this.getCrossSellItem(BdbConstants.SAVINGS_ACCOUNT));
            }
          }
        };
      } else if (tab.empty.message === 'account') {
        tab.component = DefaultViewMenuComponent;
        tab.empty = {
          img: { desktop: this.pathEmptyStates + 'advances.svg', mobile: this.pathEmptyStates + 'advances.svg' },
          message: 'Para realizar transacciones, abre tu cuenta sin costo y lista para usar de inmediato.',
          button: {
            message: 'Abrir una cuenta',
            callback: () => {
              this.crossSellProvider.handleDispatcher(this.getCrossSellItem(BdbConstants.SAVINGS_ACCOUNT));
            }
          }
        };
      }
    }

    this.tabsMenuProvider.openTab(
      tab,
      this.target,
      this.componentFactoryResolver,
      (e) => {
        if (tab.segment === 'history') {
          const instanceH: HistoryPage = e.instance as HistoryPage;
          instanceH.type = 'payment';
        } else if (tab.component === DefaultViewMenuComponent) {
          const instance: DefaultViewMenuComponent = e.instance as DefaultViewMenuComponent;
          instance.message = tab.empty.message;
          instance.img = tab.empty.img;
          instance.button = tab.empty.button;
        }
      }
    );
  }

  getCrossSellItem(key) {
    return this.crossSellProvider.crossSellItems.filter(e => e.key === key)[0];
  }

  onBackPressed() {
    this.nav.onBackPressed(this.navCtrl);
  }

  onLogout() {
    this.navCtrl.push('authentication/logout');
  }


}
