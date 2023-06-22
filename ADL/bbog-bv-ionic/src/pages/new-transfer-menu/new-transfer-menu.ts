import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PageTrack } from '../../app/core/decorators/AnalyticTrack';
import { BalanceStatus, BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { ProductDetail } from '../../app/models/products/product-model';
import { CrossSellProvider } from '../../components/cross-sell';
import { DefaultViewMenuComponent } from '../../components/default-view-menu/default-view-menu';
import { HistoryPage } from '../../pages/payments/history/history';
import { TransfersDestinationAcctPage } from '../../pages/transfers/between-accounts/transfers-destination-acct/transfers-destination-acct';
import { CashAdvanceOriginPage } from '../../pages/transfers/cash-advance/cash-advance-origin/cash-advance-origin';
import { LoanTransferOriginPage } from '../../pages/transfers/loan-transfer/loan-transfer-origin/loan-transfer-origin';
import { TrustAgreementTargetPage } from '../../pages/transfers/trust-funds/trust-agreement-target/trust-agreement-target';
import { SessionProvider } from '../../providers/authenticator/session';
import { AvalOpsProvider } from '../../providers/aval-ops/aval-ops';
import { BdbToastProvider } from '../../providers/bdb-toast/bdb-toast';
import { FilterUtilsProvider } from '../../providers/filter-utils/filter-utils';
import { FunnelEventsProvider } from '../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../providers/navigation/navigation';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { TabsMenuProvider } from '../../providers/tabs-menu/tabs-menu';
import { UnknownBalanceProvider } from '../../providers/unknown-balance/unknown-balance';
import { PbitOpsProvider } from '../../providers/pbit-ops/pbit-ops';
import { map, switchMap, take } from 'rxjs/operators';
import { UserFacade } from '../../new-app/shared/store/user/facades/user.facade';
import {
  BdbMicrofrontendEventsService
} from '../../new-app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';
import { UserFeaturesDelegateService } from '../../new-app/core/services-delegate/user-features/user-features-delegate.service';
import { Subscription } from 'rxjs/Subscription';
import { ProductsState } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.types';
import { CardsInfoFacade } from '@app/modules/settings/store/facades/cards-info.facade';

@PageTrack({ title: 'transfer-menu' })
@IonicPage({
  segment: 'transfer-menu/tab'
})
@Component({
  selector: 'page-new-transfer-menu',
  templateUrl: 'new-transfer-menu.html',
})
export class NewTransferMenuPage implements OnInit, OnDestroy {

  pathEmptyStates = BdbConstants.DIR_EMPTY_STATE;
  @ViewChild('formInternational') formInternational: any;
  spb: string;
  nid: string;
  tid: string;
  ncl: string;

  tabs = [
    {
      title: 'Historial', segment: 'history', component: HistoryPage, funnelKey: 'historyTransfer',
      initial: false
    },
    {
      title: 'Transferencias programadas', segment: 'scheduled', microfrontendRoute: '/transferencias/programadas',
      initial: false
    },
    {
      title: 'Entre Cuentas', segment: 'accounts', component: TransfersDestinationAcctPage, funnelKey: 'trMyAccount',
      empty: {
        img: { desktop: this.pathEmptyStates + 'accounts.svg', mobile: this.pathEmptyStates + 'accounts.mobile.svg' },
        message: 'Inscribe cuentas de cualquier Banco y realiza transferencias sin salir de casa.'
      },
      initial: true
    },
    {
      title: 'Avances', segment: 'advances', component: CashAdvanceOriginPage, funnelKey: 'cashAdvance',
      microfrontendRoute: '/transferencias/avances',
      empty: {
        img: { desktop: this.pathEmptyStates + 'advances.svg', mobile: this.pathEmptyStates + 'advances.mobile.svg' },
        message: 'Para realizar avances, solicita tu Tarjeta de Crédito digital en minutos.',
        button: {
          message: 'Solicita tu tarjeta',
          callback: () => {
            this.crossSellProvider.handleDispatcher(this.getCrossSellItem(BdbConstants.CREDIT_CARD));
          }
        }
      },
      initial: false
    },
    {
      title: 'Fiducias', segment: 'fiduciary', component: TrustAgreementTargetPage, funnelKey: 'fiducias',
      empty: {
        img: { desktop: this.pathEmptyStates + 'fiduciary.svg', mobile: this.pathEmptyStates + 'fiduciary.mobile.svg' },
        message: 'Próximamente podrás abrir tu fiducia acá.'
      },
      initial: false
    },
    {
      title: 'Donaciones', segment: 'donations', component: DefaultViewMenuComponent, funnelKey: 'donations',
      empty: {
        img: { desktop: this.pathEmptyStates + 'donations.svg', mobile: this.pathEmptyStates + 'donations.mobile.svg' },
        message: 'Es muy fácil ayudar, hagamoslo juntos.',
        button: {
          message: 'Donar',
          callback: () => this.navCtrl.push('DonationsPage')
        }
      },
      initial: false
    },
    {
      title: 'Uso de Crédito', segment: 'loan', component: LoanTransferOriginPage, funnelKey: 'loanTransfer',
      empty: {
        img: { desktop: this.pathEmptyStates + 'fiduciary.svg', mobile: this.pathEmptyStates + 'fiduciary.mobile.svg' },
        message: 'En esta sección encontrarás productos de Adelanto de Nómina y Crediservice.'
      },
      initial: false
    },
    {
      title: 'Moneda extranjera', segment: 'forex', component: DefaultViewMenuComponent, funnelKey: 'forex',
      empty: {
        img: { desktop: this.pathEmptyStates + 'foreign-exchange.svg', mobile: this.pathEmptyStates + 'foreign-exchange.mobile.svg' },
        message: 'Ingresa al portal de moneda extranjera donde puedes comprar y vender dólares.',
        button: {
          message: 'Ingresar',
          callback: () => {
            this.forexAction();
          }
        }
      },
      initial: false
    }
  ];

  hideSpinner = true;

  betweenAccountsActive = false;
  accounts: Array<ProductDetail> = [];
  fiducias: Array<ProductDetail> = [];
  cards: Array<ProductDetail> = [];
  credits: Array<ProductDetail> = [];
  @ViewChild('target', { read: ViewContainerRef }) target;
  @ViewChildren('selectCards') viewChildren: QueryList<ElementRef>;
  navTitle = 'Transferencias';
  private _menu = this.funnelKeysProvider.getKeys().menu;
  private _funnel;
  private externRouteSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private componentFactoryResolver: ComponentFactoryResolver,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbToast: BdbToastProvider,
    private avalOps: AvalOpsProvider,
    private events: Events,
    private filterUtils: FilterUtilsProvider,
    private navigation: NavigationProvider,
    private tabsMenuProvider: TabsMenuProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private crossSellProvider: CrossSellProvider,
    private unknownBalance: UnknownBalanceProvider,
    private pbitOps: PbitOpsProvider,
    private loadingCtrl: LoadingController,
    private userFacade: UserFacade,
    private bdbMicrofrontendEventsService: BdbMicrofrontendEventsService,
    private userFeaturesService: UserFeaturesDelegateService,
    private cardsInfoFacade: CardsInfoFacade
  ) { }

  ionViewWillEnter() {
    this.funnelEventsProvider.callFunnel(this._menu, this._menu.steps.transfers);
    this.events.publish('menu:active', 'NewTransferMenuPage');
    this.events.publish('srink', false);
  }

  ngOnInit() {
    this.userFeaturesService
    .isAllowedServiceFor('betweenAccounts')
    .pipe(take(1))
    .subscribe((isActive) => {
      this.betweenAccountsActive = isActive;
    });
    const tab = this.navParams.get('tab');
    if (!!tab) {
      const mTab = this.tabs.find(e => e.segment === tab);
      this.validateProds(mTab);
    } else {
      this.validateProds(this.tabs[2]);
    }
    this.userFeaturesService.isAllowedServiceFor('scheduledTransfers')
      .pipe(take(1))
      .subscribe((isActive) => {
        if (!isActive) {
          this.tabs = this.tabs.filter(tabElement => tabElement.microfrontendRoute !== '/transferencias/programadas');
        }
      });
    this.userFeaturesService.isAllowedServiceFor('cashAdvance')
      .pipe(take(1))
      .subscribe((isActive) => {
        if (!isActive) {
          this.tabs.forEach((tabItem: any) => {
            if (tabItem.microfrontendRoute && tabItem.microfrontendRoute === '/transferencias/avances') {
              delete tabItem.microfrontendRoute;
            }
            return tabItem;
          });
        }
      });
    this.externRouteSubscription = this.bdbMicrofrontendEventsService.externalRoute$.subscribe(route => {
      if (route && route.name === 'NewTransferMenuPage' && route.paramValue) {
        const mTab: any = this.tabs.find(e => e.segment === route.paramValue);
        const tabEl = this.viewChildren.find((item) => item.nativeElement.innerText.includes(mTab.title));
        tabEl.nativeElement.click();
        this.tabs.forEach((tabItem: any) => tabItem.active = tabItem.segment === route.paramValue);
        tabEl.nativeElement.selected = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.externRouteSubscription) {
      this.externRouteSubscription.unsubscribe();
    }
  }

  changeTab(tab) {
    if (tab.microfrontendRoute) {
      if (
        (tab.microfrontendRoute === "/transferencias/entre-cuentas" &&
          this.betweenAccountsActive) ||
        tab.microfrontendRoute !== "/transferencias/entre-cuentas"
      ) {
        return this.bdbMicrofrontendEventsService.sendRouteEventToParentWindow(
          tab.microfrontendRoute
        );
      } else if (tab.microfrontendRoute === '/transferencias/avances') {
        this.setProductsState();
        return this.bdbMicrofrontendEventsService.sendRouteEventToParentWindow(
          tab.microfrontendRoute
        );
      }
    }
    this.bdbMicrofrontendEventsService.sendRouteEventToParentWindow('/dashboard');
    this.mapTabs(tab);
  }

  private setProductsState(): void {
    const products = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    if (!!products) {
      const filtratedData: ProductsState[] = products
      .map((product) => ({
        ...product.productDetailApi,
        balanceDetail: product.balanceDetail,
      }));
      this.bdbMicrofrontendEventsService.saveStateInSessionStorage<ProductsState[]>(
        'ProductsState',
        filtratedData
      );
    }
  }

  validateProds(mTab) {
    const customerProducts = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    if (
      mTab.microfrontendRoute === '/transferencias/entre-cuentas' &&
      this.betweenAccountsActive
    ) {
      mTab.active = true;
      this.mapFilters(customerProducts);
      this.loadCheckAccounts(customerProducts);
      return this.bdbMicrofrontendEventsService.sendRouteEventToParentWindow(
        mTab.microfrontendRoute
      );
    }
    if (!!customerProducts) {
      this.mapFilters(customerProducts);
      this.mapTabs(mTab);
      this.events.publish('menu:products', true);
      this.loadCheckAccounts(customerProducts);
    } else {
      this.events.publish('menu:products', false);
      this.hideSpinner = false;
      this.avalOps.getAccountListByBank().subscribe(
        (newCustomerProducts: ProductDetail[]) => {
          this.mapFilters(newCustomerProducts);
          this.mapTabs(mTab);
          this.events.publish('menu:products', true);
          this.loadCheckAccounts(newCustomerProducts);
        },
        (err) => {
          this.bdbToast.showToastAction(
            'Error consultando los productos', 'Reintentar',
            () => {
              this.validateProds(mTab);
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
        this.bdbInMemory.setItemByKey(InMemoryKeys.CustomerProductList, customerProducts);
        this.hideSpinner = true;
      } else if (balanceStatus === BalanceStatus.FINISHED_WITH_ERROR) {
        this.hideSpinner = true;
        this.bdbToast.showToast('Algunas de tus cuentas no pudieron ser consultadas');
      }
    });
  }

  mapFilters(customerProducts) {
    this.accounts = customerProducts.filter(this.filterUtils.getValidAccountsToPay());
    this.fiducias = customerProducts.filter(e => {
      return e.category === BdbConstants.FIDUCIAS_BBOG;
    });
    this.cards = customerProducts.filter(e => {
      return e.category === BdbConstants.TARJETA_CREDITO_BBOG;
    });
    this.credits = customerProducts.filter(e => {
      return e.productType === BdbConstants.ATH_ADELANTO_NOMINA
        || e.productType === BdbConstants.ATH_CREDISERVICE_ALS_PNATURAL
        || e.productType === BdbConstants.ATH_CREDISERVICE_AP;
    });
  }

  mapTabs(tab) {
    tab.active = true;
    if (!!tab.funnelKey) {
      this._funnel = this.funnelKeysProvider.getKeys()[tab.funnelKey];
    }
    tab = this.validateTabProducts(tab);


    this.tabsMenuProvider.openTab(
      tab,
      this.target,
      this.componentFactoryResolver,
      (e) => {
        if (tab.component === DefaultViewMenuComponent && this.accounts.length === 0) {
          const instance: DefaultViewMenuComponent = e.instance as DefaultViewMenuComponent;
          instance.message = 'Para realizar transacciones, abre tu cuenta sin costo y lista para usar de inmediato.';
          instance.img = { desktop: this.pathEmptyStates + 'advances.svg', mobile: this.pathEmptyStates + 'advances.mobile.svg' };
          instance.button = {
            message: 'Abrir una cuenta',
            callback: () => {
              this.crossSellProvider.handleDispatcher(this.getCrossSellItem(BdbConstants.SAVINGS_ACCOUNT));
            }
          };
        } else if (tab.component === DefaultViewMenuComponent && this.accounts.length > 0) {
          const instance: DefaultViewMenuComponent = e.instance as DefaultViewMenuComponent;
          instance.message = tab.empty.message;
          instance.img = tab.empty.img;
          instance.button = tab.empty.button;
        } else if (tab.segment === 'history') {
          const instanceH: HistoryPage = e.instance as HistoryPage;
          instanceH.type = 'transfer';
        }
      }
    );
  }

  checkExistingProducts(products: any) {

    let validation = true;

    products.forEach(e => {
      if (this[e].length === 0) {
        validation = false;
      }
    });

    return validation;
  }

  validateTabProducts(tab) {

    switch (tab.segment) {
      case 'history':
      case 'accounts':
      case 'donations':
        if (!this.checkExistingProducts(['accounts'])) {
          tab.component = DefaultViewMenuComponent;
        }
        break;
      case 'advances':
        if (!this.checkExistingProducts(['accounts', 'cards'])) {
          tab.component = DefaultViewMenuComponent;
        }
        break;
      case 'fiduciary':
        if (!this.checkExistingProducts(['accounts', 'fiducias'])) {
          tab.component = DefaultViewMenuComponent;
        }
        break;
      case 'loan':
        if (!this.checkExistingProducts(['accounts', 'credits'])) {
          tab.component = DefaultViewMenuComponent;
        }
        break;
    }

    return tab;
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
    this.bdbMicrofrontendEventsService.sendRouteEventToParentWindow('/dashboard');
  }

  onLogout() {
    this.navCtrl.push('authentication/logout');
  }

  getCrossSellItem(key) {
    return this.crossSellProvider.crossSellItems.filter(e => e.key === key)[0];
  }

  forexAction() {
    const load = this.loadingCtrl.create();

    this.userFacade.basicData$.pipe(
      take(1),
      map(userInfo => !!userInfo ? `${userInfo.firstName}_${userInfo.lastName}` : ''),
      switchMap((name) => this.pbitOps.dataRedirect(name))
    ).subscribe(
      data => {
        this.spb = data.sessionId;
        this.nid = data.userDocumentId;
        this.tid = data.userDocumentType;
        this.ncl = data.userFullName;
        const formAction = this.formInternational.nativeElement;
        formAction.action = data.internationalLink;
        setTimeout(() => {
          formAction.submit();
          load.dismiss();

        }, 10);
      },
      error => {
        console.error('error --> ', error);
      }
    );
  }

}
