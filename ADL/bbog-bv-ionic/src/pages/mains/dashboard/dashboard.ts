import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  EventEmitter
} from '@angular/core/';
import {
  App,
  Events,
  IonicPage,
  LoadingController,
  MenuController,
  ModalController,
  NavController,
  Platform
} from 'ionic-angular';
import { PageTrack } from '../../../app/core/decorators/AnalyticTrack';
import { CustomerCard } from '../../../app/models/activation-cards/customer-cards-list-rs';
import { BdbConstants } from '../../../app/models/bdb-generics/bdb-constants';
import { BdbMap } from '../../../app/models/bdb-generics/bdb-map';
import { BdbShortcutCard } from '../../../app/models/bdb-shortcut-card';
import { CardNotification } from '../../../app/models/card-notification';
import { CashAdvanceInfo } from '../../../app/models/cash-advance/cash-advance-info';
import { LoanPaymentInfo } from '../../../app/models/credits/loan-payment-info';
import { AccountAny } from '../../../app/models/enrolled-transfer/account-any';
import { Pocket } from '../../../new-app/root/products/pockets/models/pocket';
import { mapDetailsBalance, ProductDetail } from '../../../app/models/products/product-model';
import { CreditCardPaymentInfo } from '../../../app/models/tc-payments/credit-card-payment-info';
import { TooltipOptions } from '../../../app/models/tooltip-options';
import { CrossSellProvider, CsMainModel } from '../../../components/cross-sell';
import { AccessDetailProvider } from '../../../providers/access-detail/access-detail';
import { AvalOpsProvider } from '../../../providers/aval-ops/aval-ops';
import { GetBalancesByAccountRs } from '../../../providers/aval-ops/aval-ops-models';
import { BdbMaskProvider } from '../../../providers/bdb-mask/bdb-mask';
import { MaskType } from '../../../providers/bdb-mask/bdb-mask-type.enum';
import { BdbModalProvider } from '../../../providers/bdb-modal/bdb-modal';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';
import { CardsMapperProvider, PCardModel } from '../../../providers/cards-mapper/cards-mapper';
import { FunnelEventsProvider } from '../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../providers/funnel-keys/funnel-keys';
import { LoanOpsProvider } from '../../../providers/loan-ops/loan-ops';
import { PocketOpsService } from '../../../new-app/root/products/pockets/services/pocket-ops.service';
import { PrivateModeProvider } from '../../../providers/private-mode/private-mode';
import { QuickAccessProvider } from '../../../providers/quick-access/quick-access';
import { SelectAccountHandlerProvider } from '../../../providers/select-account-handler/select-account-handler';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { TooltipOpsProvider } from '../../../providers/tooltip-ops/tooltip-ops';
import { TuPlusOpsProvider, TuPlusRs } from '../../../providers/tu-plus-ops';
import { UnknownBalanceProvider } from '../../../providers/unknown-balance/unknown-balance';
import { Observable } from 'rxjs/Observable';
import { PulseModalControllerProvider } from '../../../providers/pulse-modal-controller/pulse-modal-controller';
import { PocketExceedMaxComponent } from '../../../new-app/root/products/pockets/components/pocket-exceed-max/pocket-exceed-max';
import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { BillersPaymentFacade } from '../../../new-app/modules/payments/store/facades/billers-payment.facade';
import { TransactionsProvider } from '../../../providers/transactions/transactions';
import { CampaignDashUnicefComponent } from '../../../new-app/modules/dashboard/components/modals/campaign-dash-modal/campaign-dash-unicef';
import { CampaignMillionBanquetComponent } from '../../../new-app/modules/dashboard/components/modals/million-banquet-modal/million-banquet-modal';
import { DashboardBannerCampaignsService } from '../../../new-app/modules/dashboard/services/dashboard-banner-campaigns.service';
import { Subscription } from 'rxjs/Subscription';
import { CardsInfoFacade } from '../../../new-app/modules/settings/store/facades/cards-info.facade';
import { UserFacade } from '../../../new-app/shared/store/user/facades/user.facade';
import { filter, take, tap } from 'rxjs/operators';
import { UserFeatures } from '../../../new-app/core/services-apis/user-features/models/UserFeatures';
import { UserFeaturesDelegateService } from '@app/delegate/user-features/user-features-delegate.service';
import { DashboardCardActivationService } from '../../../new-app/modules/dashboard/services/dashboard-card-activation.service';
import { DashboardCardActivation } from '../../../new-app/modules/dashboard/models/dashboard-cardActication.model';
import { TokenOtpProvider } from '../../../providers/token-otp/token-otp/token-otp';
import { CDTService } from '@app/modules/products/services/cdt.service';
import { IdentificationTypeListProvider } from '../../../providers/identification-type-list-service/identification-type-list-service';
import { map } from 'rxjs/operators';
import { CreditCardFacade } from '@app/shared/store/products/facades/credit-card.facade';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { CreditCardActivationRq } from '@app/apis/customer-security/models/creditCardActivation';
import { BasicDataRs } from '@app/apis/customer-basic-data/models/getBasicData.model';
import getRandomInt from '@app/shared/utils/functions/random-number';
import {CatalogsEnum} from '@app/delegate/list-parameters/enums/catalogs-enum';
import {ExtraordinaryPaymentService} from '@app/modules/payments/services/extraordinary-payment.service';
import {ExtraordinaryPaymentRs} from '@app/apis/payment-nonbillers/models/extraordinary-payment.model';
import { BdbUtilsProvider } from '../../../providers/bdb-utils/bdb-utils';
import {BdbMicrofrontendEventsService} from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';

@PageTrack({ title: 'dash' })
@IonicPage({
  segment: 'dash'
})
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('switch') switch;
  @ViewChild('secondCol') secondCol;
  @ViewChildren('cards') cards: QueryList<ElementRef>;

  private readonly CONST_MILLION_BANQUET_CODE = '3428';

  currentBp = '';
  isMobile = false;
  customerBasicData: Observable<BasicDataRs>;
  greet = '';
  newPockets = 'Nueva alcancía';
  showPocketSection = false;
  hasSavingAccounts = true;
  showAddPocket = false;
  public pocketList: Pocket[] = [];
  private title: string;
  private tuPlusPoints: string;
  private tuPlusLoader = false;
  private tuPlusError = false;
  private creditCardSubscription: Subscription;
  pocketsLoading = false;
  basePath: string;
  // shortcut vars
  pendingBills: Array<BdbShortcutCard> = [];
  enrolledAccts: Array<BdbShortcutCard> = [];
  loadingAccts: Boolean = true;
  // cross sell card vars
  mosaicList: Array<CsMainModel> = [];
  mainCard: CsMainModel = new CsMainModel();
  approvedCard: any;
  allowedCreatePocket = true;

  cardActivation: any;
  isHelpCenterActive$: Observable<boolean>;

  _productCards: Array<PCardModel> = [];
  set productCards(products: Array<PCardModel>) {
    this._productCards = products;
    if (this.showPocketSection) {
      this.pocketList = [];
      this.getPockets();
    }
  }

  private _funnel = this.funnelKeysProvider.getKeys().menu;

  // ActivationCard
  isActivationCard = false;
  creditCardActivation = false;
  debitCardActivation = false;
  multipleCardsActivation = false;
  isFiduciaryNotification = false;
  activationCardSelected: CustomerCard;
  isActivationDebitCard = false;
  isShowCard: boolean;

  // card notifications
  cardNotification: CardNotification = {
    firstText: 'Ya puedes activar<br>tu <strong>Tarjeta Débito</strong>',
    secondText: 'Actívala aquí <img src="assets/imgs/round-chevron-left-24-px-white.svg">',
    principalImg: 'assets/imgs/act-img-card.svg'
  };

  showProdsSpinner = false;
  showTuPlusCard = false;
  isPrivateMode = false;
  shorcutAddMode = 'light';
  deferredPrompt;

  private _cards = this.funnelKeysProvider.getKeys().cards;
  private _credits = this.funnelKeysProvider.getKeys().credits;
  private _cdt = this.funnelKeysProvider.getKeys().cdt;

  private showCookie: boolean;

  pendingBillsApi$: Observable<BdbShortcutCard[]> = this.billersPaymentFacade.pendingBills$;
  billersPaymentWorking$: Observable<boolean> = this.billersPaymentFacade.billersPaymentWorking$;
  billersPaymentCompleted$: Observable<boolean> = this.billersPaymentFacade.billersPaymentCompleted$;

  private cardsInfoSubscription: Subscription;
  private productsInquiryEmitter: EventEmitter<boolean>;
  private productsInquiryFinished = false;
  private presentTooltips = true;

  constructor(
    public menu: MenuController,
    private bdbPlatforms: BdbPlatformsProvider,
    private plt: Platform,
    private _app: App,
    public navCtrl: NavController,
    private bdbInMemoryProvider: BdbInMemoryProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEvent: FunnelEventsProvider,
    private quickAccess: QuickAccessProvider,
    private crossSell: CrossSellProvider,
    private modalCtrl: ModalController,
    private avalOps: AvalOpsProvider,
    private cardsMapper: CardsMapperProvider,
    private loanOps: LoanOpsProvider,
    private bdbModal: BdbModalProvider,
    private bdbMask: BdbMaskProvider,
    private loadingCtrl: LoadingController,
    private events: Events,
    private privateMode: PrivateModeProvider,
    private unknownBalanceHandler: UnknownBalanceProvider,
    private tuPlus: TuPlusOpsProvider,
    private tooltipOps: TooltipOpsProvider,
    private accessDetail: AccessDetailProvider,
    private pocketOps: PocketOpsService,
    private selectAccountHandler: SelectAccountHandlerProvider,
    private userFeaturesService: UserFeaturesDelegateService,
    private dashboardCardActivationService: DashboardCardActivationService,
    private billersPaymentFacade: BillersPaymentFacade,
    private pulseModalCtrl: PulseModalControllerProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private transactionProvider: TransactionsProvider,
    private dashCampaignsService: DashboardBannerCampaignsService,
    private cardsInfoFacade: CardsInfoFacade,
    private userFacade: UserFacade,
    private tokenOtp: TokenOtpProvider,
    private cdtService: CDTService,
    private identificationTypeListProvider: IdentificationTypeListProvider,
    private creditCardFacade: CreditCardFacade,
    private genericModalService: GenericModalService,
    private extraordinaryPaymentService: ExtraordinaryPaymentService,
    private bdbUtilsProvider: BdbUtilsProvider,
    private bdbMicrofrontendEventsService: BdbMicrofrontendEventsService
  ) {
    this.productsInquiryEmitter = new EventEmitter();
    this.basePath = 'assets/imgs/cross-sell/';
    this.loadingAccts = true;
    this.isMobile = bdbPlatforms.isMobile();
    this.title = 'Tus productos';
    this.plt.registerBackButtonAction(() => {
      if (navCtrl.canGoBack) {
        navCtrl.pop();
      }
    }, 1);
    this.isHelpCenterActive$ = this.userFeaturesService.isAllowedServiceFor('helpCenter');
  }

  ngOnInit() {
    const d = new Date();
    const n = d.getHours();
    if (n >= 0 && n < 12) {
      this.greet = 'Buenos días';
    } else if (n >= 12 && n < 18) {
      this.greet = 'Buenas tardes';
    } else {
      this.greet = 'Buenas noches';
    }
    this.creditCardSubscription = this.creditCardFacade.creditCardActivationState$
      .pipe(take(2), tap(res => this.isShowCard = res.creditCardsBannerHidden))
      .subscribe();
    this.userFacade.getCatalogue(CatalogsEnum.BANK_LIST);
  }

  ngAfterViewInit() {
    this.secondCol.nativeElement.addEventListener('scroll', () => {
      this.scrollTooltips();
    });

    this.cards.changes.subscribe((r) => {
      if (this.showCookie && !this.bdbPlatforms.isMobile() && !this.bdbPlatforms.isTablet()) {
        const cardtooltip = document.getElementById('cardtooltip');
        if (!cardtooltip) {
          this.loadCardsTooltip();
        }
      }
    });
  }

  ngOnDestroy() {
    this.tooltipOps.removeAllTooltip();
    if (!!this.cardsInfoSubscription) {
      this.cardsInfoSubscription.unsubscribe();
    }
  }

  ionViewDidLoad() {
    this._app.setTitle(this.title);
    this.funnelEvent.callFunnel(this._funnel, this._funnel.steps.products);
    // this.onboardingHome.isViewOnboarding();
    // this.checkDashURL();
  }

  ionViewWillEnter() {
    this.initialize();
  }

  private initialize(): void {
    this.userFacade.getUserFeaturesData();
    this.cardsInfoFacade.fetchCardsInfo();
    this.customerBasicData = this.userFacade.basicData$;
    this.validatePockets();
    this.showCookie = this.tooltipOps.validateCookie();
    this.buildShortcut();
    this.getInactiveCardsAndCustomerInfo();
    this.getPrivateMode();
    this.validateDashboardCampaign();
    this.setShortcutAddMode();
    this.checkIdForTuPlus();
    this.getTextFromFiduciary();
    if (this.showCookie) {
      this.loadPrivateModeTooltip();
    }
    this.events.publish('menu:active', 'DashboardPage');
    this.events.publish('srink', false);
    this.accessDetail.unselectedDestination();
    this.accessDetail.unselectedOrigin();
    this.bdbInMemoryProvider.clearItem(InMemoryKeys.CashAdvanceInfo);
    this.bdbInMemoryProvider.clearItem(InMemoryKeys.TrustAgreementInfo);

    this.userFacade.getBasicData();
    this.userFacade.getLastLogin();
    this.validateProducts();
    this.getTextFromFiduciary();

  }

  setShortcutAddMode() {
    const size = window.innerWidth;
    if (size >= 768) {
      this.shorcutAddMode = 'light';
    } else {
      this.shorcutAddMode = 'dark';
    }
  }

  private validatePockets(): void {
    this.userFeaturesService.isAllowedServiceFor('pockets')
      .pipe(map(isAllowed => !!isAllowed && !this.identificationTypeListProvider.isLegalPerson()))
      .subscribe(res => this.showPocketSection = this.pocketsLoading = res);
  }

  private getPockets(): void {
    const tempPocketList: { [key: string]: Pocket[] } = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.CustomerPocketList);
    const savingAccounts: ProductDetail[] = this.selectAccountHandler.getAccountsByType(false, [BdbConstants.ATH_SAVINGS_ACCOUNT]);
    let count = 0;
    const validateCount = () => {
      count++;
      this.pocketsLoading = count !== savingAccounts.length;
    };
    this.hasSavingAccounts = this.pocketsLoading = savingAccounts.length > 0;
    savingAccounts.forEach((account: ProductDetail, i: number) => {
      if (!!tempPocketList && !!tempPocketList[`${account.productNumberApi}`]) {
        this.pocketList.push(...tempPocketList[`${account.productNumberApi}`]);
        validateCount();
      } else {
        this.pocketOps.getPocketsByAccount(account)
          .subscribe(
            (pocketsByAccount: Pocket[]) => {
              this.pocketList.push(...pocketsByAccount);
              if (savingAccounts.length === 1) {
                if (pocketsByAccount.length >= 5) {
                  this.allowedCreatePocket = false;
                }
              }
              validateCount();
            }, (err) => {
              validateCount();
            }
          );
      }
    });
  }

  private handleCrollSellFiducia(): void {
    this.crossSell.getFiduciaryItem().subscribe(
      card => {
        const index = getRandomInt(0, this.mosaicList.length - 1);
        this.mosaicList.splice(index, 1);
        this.mosaicList.push(card);
      }, () => {}
    );
  }

  ionViewWillLeave() {
    this.tooltipOps.removeAllTooltip();
    if (this.creditCardSubscription) {
      this.creditCardSubscription.unsubscribe();
    }
  }

  scrollTooltips() {
    this.tooltipOps.recalcTooltip();
  }

  scrollHandler(ev) {
    if (ev.scrollTop > 159) {
      this.tooltipOps.removeTooltip('pmtooltip');
      return;
    }
    this.scrollTooltips();
  }

  breakpointChanged(bk) {
    if (bk === 'xs') {
      this.tooltipOps.removeTooltip('cardtooltip');
      this.shorcutAddMode = 'dark';
    } else if (bk === 'md') {
      this.shorcutAddMode = 'dark';
    } else {
      this.shorcutAddMode = 'light';
    }
    const pos = this.getTooltipPositions(window.innerWidth);
    const activeTooltips = this.tooltipOps.getActiveTooltips();
    activeTooltips.forEach(e => {
      e.element.position = pos[e.id];
    });
  }

  getTooltipPositions(width): { pmtooltip: string, cardtooltip: string } {
    if (width < 540) {
      return {
        pmtooltip: 'top-end',
        cardtooltip: 'top-end'
      };
    } else if (width < 768) {
      return {
        pmtooltip: 'right-start',
        cardtooltip: 'top-end'
      };
    } else {
      return {
        pmtooltip: 'left-start',
        cardtooltip: 'left-start'
      };
    }
  }

  mapCards(data: Array<ProductDetail>): Array<PCardModel> {
    return data.map((e: ProductDetail) => {
      const card = this.cardsMapper.mapToPCard(e);
      card.pBalance.value = this.bdbMask.maskFormatFactory(card.pBalance.value, MaskType.CURRENCY);
      return card;
    });
  }

  buildShortcut() {
    this.billersPaymentFacade.fetchBillersPayment();
    this.quickAccess.getSuggestedAccounts((accts) => {
      this.enrolledAccts = accts;
      this.loadingAccts = false;
    });
  }

  loadPrivateModeTooltip() {
    const pos = this.getTooltipPositions(window.innerWidth);
    const options: TooltipOptions = {
      objectdesthtml: this.switch.nativeElement,
      color: 'primary',
      tiptitle: 'Modo privado:',
      description: 'Al activarlo los saldos de tus productos se ocultarán',
      elevation: 4,
      colorvariant: '400',
      position: pos.pmtooltip,
      id: 'pmtooltip'
    };
    if (this.presentTooltips) {
      this.tooltipOps.presentToolTip(options).subscribe((id) => {
        this.tooltipOps.assignElements(id);
      });
    }
  }

  loadCardsTooltip() {
    const pos = this.getTooltipPositions(window.innerWidth);
    const q: ElementRef = this.cards.toArray()[0];
    if (!!q) {
      const options: TooltipOptions = {
        objectdesthtml: q.nativeElement,
        color: 'primary',
        tiptitle: 'Consulta detallada:',
        description: 'Da clic en el producto para consultar detalles y movimientos.',
        elevation: 4,
        colorvariant: '400',
        position: pos.cardtooltip,
        id: 'cardtooltip'
      };
      if (this.presentTooltips) {
        this.tooltipOps.presentToolTip(options).subscribe((id) => {
          this.tooltipOps.assignElements(id);
        });
      }
    }
  }

  checkIdForTuPlus() {
    const IdentificationType: string = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.IdentificationType);
    const notValidDocumentsInTuplus = ['NE', 'NI', 'NJ'];
    const validUserTuplus = (notValidDocumentsInTuplus.indexOf(IdentificationType) === -1);
    if (validUserTuplus) {
      this.getTuPlusPoints();
    }
  }

  validateProducts() {
    const customerProductList: ProductDetail[] = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.CustomerProductList);
    if (!!customerProductList) {
      this.productCards = this.mapCards(customerProductList);
      this.events.publish('menu:products', true);
      this.showProdsSpinner = false;
      this.getUknownBalance(customerProductList);
      this.setupCrossSellCards();
      this.productsInquiryFinished = true;
      this.productsInquiryEmitter.emit(true);
      this.validateShowFiduciaryNotificationCard();
    } else {
      this.events.publish('menu:products', false);
      this.showProdsSpinner = true;
      this.avalOps.getAccountListByBank().subscribe(
        (data: ProductDetail[]) => {
          this.showProdsSpinner = false;
          this.productCards = this.mapCards(data);
          this.events.publish('menu:products', true);
          this.getUknownBalance(data);
          this.setupCrossSellCards();
          this.productsInquiryFinished = true;
          this.productsInquiryEmitter.emit(true);
          this.validateShowFiduciaryNotificationCard();
        },
        (err) => {
          this.setupCrossSellCards();
          this.showProdsSpinner = false;
          this.productsInquiryFinished = true;
          this.productsInquiryEmitter.emit(false);
          this.bdbModal.launchErrModal('Error', 'Error consulta de productos', 'Aceptar');
        }
      );
    }
  }

  getUknownBalance(customerProductList: ProductDetail[]) {
    customerProductList.filter((e: ProductDetail) => e.description === BdbConstants.UNKNOWN)
      .forEach((f: ProductDetail) => {
        const tempCard = this._productCards.find(t => t.product.productNumberX === f.productNumberX);
        tempCard.showBalanceLoader = true;

        this.avalOps.getBalancesByAccount(f).subscribe(
          (balance: GetBalancesByAccountRs) => {
            const bDetail = mapDetailsBalance(balance.details);
            f.balanceDetail = bDetail;
            tempCard.product.balanceDetail = bDetail;
            const hasProgressBar = this.unknownBalanceHandler.addCreditLineBar(f.category, f.productType);
            const hasNextPayment = this.unknownBalanceHandler.hasNextPayment(f);
            this.unknownBalanceHandler.updateBalance(tempCard, f);
            if (hasProgressBar) {
              const creditLine = this.cardsMapper.getCreditLine(f);
              tempCard.creditLine = this.bdbMask.maskFormatFactory(creditLine, BdbConstants.namedMap['cupoTarjetaBBOG'].format);
              tempCard.progress = (f.amount / creditLine) * 100 + '%';
            }
            if (hasNextPayment) {
              tempCard.paymentAvailable = true;
              tempCard.minPay.key = this.cardsMapper.getMinPaymentLabel(f);
              const value = this.cardsMapper.getMinPaymentValue(f);
              tempCard.minPay.value = this.bdbMask.maskFormatFactory(
                value, BdbConstants.namedMap['pagMinimoBBOG'].format2);
              tempCard.nextDate.key = BdbConstants.namedMap.fecProxPagoBBOG.label2;
              tempCard.nextDate.value = this.bdbMask.maskFormatFactory(
                f.balanceDetail.fecProxPagoBBOG, BdbConstants.namedMap['fecProxPagoBBOG'].format2);
            }
            this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.CustomerProductList, customerProductList);
            tempCard.showBalanceLoader = false;
            if (f.category === BdbConstants.FIDUCIAS_BBOG && f.productNumber.startsWith('060') && f.balanceDetail.totalBBOG === '0') {
              this.isFiduciaryNotification = true;
            }
          },
          (err) => {
            tempCard.pBalance.key = 'Sin información';
            tempCard.pBalance.value = '---';
            tempCard.showBalanceLoader = false;
          }
        );
      });
  }

  private getInactiveCardsAndCustomerInfo(): void {
    this.cardsInfoSubscription = this.cardsInfoFacade.cardsInfo$.subscribe(
      (customerCardList: CustomerCard[]) => {
        this.validateShowActivationCards(customerCardList);
      }
    );
  }

  private validateShowActivationCards(customerCardsList: CustomerCard[]): void {
    const isViewActDebitCard = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.ViewActDebitCard);
    if (isViewActDebitCard === false) {
      return;
    }
    const cardNotificationService: DashboardCardActivation = this.dashboardCardActivationService.validateActivationType(customerCardsList);
    this.cardNotification.firstText = cardNotificationService.CardFirstText;
    this.cardNotification.secondText = cardNotificationService.CardSecondText;
    this.activationCardSelected = cardNotificationService.activationCardSelected;
    this.multipleCardsActivation = cardNotificationService.multipleCardsActivation;
    this.isActivationCard = cardNotificationService.isActivationCard;
    this.debitCardActivation = cardNotificationService.debitCardActivation;
    this.creditCardActivation = cardNotificationService.creditCardActivation;
    this.cardActivation = cardNotificationService;
    this.tooltipOps.recalcTooltip();
  }
  private validateShowFiduciaryNotificationCard(): void {
    const customerProductList: ProductDetail[] = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.CustomerProductList);
    const ficProduct = customerProductList.filter(p => {
      return (p.productNumber.startsWith('060') && !!p.balanceDetail && p.balanceDetail.totalBBOG === '0');
    });
    if (ficProduct.length !== 0) {
      this.isFiduciaryNotification = true;
    }
  }

  public validateCardAction(): void {
    if (this.debitCardActivation) {
      this.activationDebitCard();
    } else if (this.creditCardActivation) {
      this.validateActiveCreditCard();
    } else if (this.multipleCardsActivation) {
      this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.ListCardsActivate, this.cardActivation.cardsActivation);
      this.navCtrl.push('CardSelectionPage');
    }
  }

  activationDebitCard() {
    const item: BdbMap = {
      key: 'debitCardNumber',
      value: 'Activación de Tarjetas',
      template: 'debit-card-number'
    };
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.ActivationCard, this.activationCardSelected);
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.ValidateNumberCard, this.activationCardSelected.lastDigits);
    if (!this.bdbPlatforms.isBrowser()) {
      const profileModal = this.modalCtrl.create('ModalTransactionsPage', item);
      profileModal.present();
    } else {
      this.navCtrl.push(item.template);
    }
  }

  closeActDebitCard() {
    this.isActivationDebitCard = false;
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.ViewActDebitCard, false);
  }

  investFiduciaryProduct() {
    const product = this._productCards.find(prCard => {
      return prCard.product.productNumber.startsWith('060') && !!prCard.product.balanceDetail && prCard.product.balanceDetail.totalBBOG === '0';
    }).product;
    this.accessDetail.setDestinationSelected(product);
    this.navCtrl.push('TrustAgreementAmountPage', null, {
      animate: true,
      animation: 'ios-transition'
    });
  }
  public productsAval() {
    this.navCtrl.push('SelectionAvalPage', null, {
      animate: true,
      animation: 'ios-transition'
    });
  }

  onConfiguration() {
    this.tooltipOps.removeAllTooltip();
    this.navCtrl.push('settings%app');
  }

  onButtonCad() {
    this.bdbMicrofrontendEventsService.sendRouteEventToParentWindow('/ayuda');
  }

  onCardClicked(p: PCardModel) {
    if (p.product.category === BdbConstants.CDT_BBOG ||
      p.product.productTypeBDB === 'CDA'
    ) {
      if (p.product.productName === 'CDT Digital') {
        this.onDigitalCDTClicked(p);
      }
      return;
    }
    this.onPayClicked(p, false);
    if (p.product.balanceDetail && p.product.balanceDetail !== {}) {
      this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.ProductDetail, p.product);
      this.sendToDetailPage();
    } else {
      this.getBalance(p.product);
    }
  }

  onPayClicked(p: PCardModel, direct = true) {
    this.accessDetail.unselectedOrigin();

    if (p.product.category === BdbConstants.TARJETA_CREDITO_BBOG) {
      this.funnelEvent.callFunnel(this._cards, this._cards.steps.pickCard);
      const creditCard: AccountAny = new AccountAny(true, p.product, null);
      this.saveCC(creditCard);
      if (direct) {
        this.launchCCAmount();
      }
    } else if (p.product.category === BdbConstants.CREDITOS_BBOG) {
      this.funnelEvent.callFunnel(this._credits, this._cards.steps.pickCard);

      this.saveCredit(p.product);
      if (direct) {
        this.launchCreditAmount(p.product);
      }
    }
  }

  launchCreditAmount(product: ProductDetail) {
    const item: BdbMap = {
      key: 'creditPayments',
      value: 'Créditos',
      template: 'credit%amount%select'
    };
    const loader = this.loadingCtrl.create();
    loader.present();
    this.extraordinaryPaymentService.checkExtraPayment('bdbCardDetail', product)
      .subscribe({
        next: (res: ExtraordinaryPaymentRs) => {
          product.hasAdvancePmnt = res.status === '1';
          this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.ProductDetail, product);
          this.navCtrl.push(item.template, {flag: 'bdbCardDetail'});
        }
        , error:
          error => {
            console.log('error consultando advance payment');
            loader.dismiss();
            this.navCtrl.push(item.template, {flag: 'bdbCardDetail'});
          },
        complete: () => {
          loader.dismiss();
        }
      });
  }

  launchCCAmount() {
    const item: BdbMap = {
      key: 'ccPayments',
      value: 'Tarjetas de Crédito',
      template: 'creditcard%amount%select'
    };
    this.navCtrl.push(item.template);
  }

  saveCredit(loan: ProductDetail) {
    const loanPaymentInfo: LoanPaymentInfo = new LoanPaymentInfo();
    const mLoan = new AccountAny(true, loan, null);
    loanPaymentInfo.loan = mLoan;
    loanPaymentInfo.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.LoanPaymentInfo, loanPaymentInfo);
  }

  saveCC(creditCard: AccountAny) {
    const ccPaymentInfo: CreditCardPaymentInfo = new CreditCardPaymentInfo();
    ccPaymentInfo.creditCard = creditCard;
    ccPaymentInfo.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.CreditCardInfo, ccPaymentInfo);
    if (!!creditCard.accountOwned) {
      const aCashInfo: CashAdvanceInfo = new CashAdvanceInfo();
      aCashInfo.creditCard = creditCard.accountOwned;
      this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.CashAdvanceInfo, aCashInfo);
    }
  }

  getBalance(product: ProductDetail) {
    this.bdbInMemoryProvider.clearItem(InMemoryKeys.ProductDetail);
    const load = this.loadingCtrl.create();
    load.present();
    const prods: ProductDetail[] = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.CustomerProductList);
    this.avalOps.getBalancesByAccount(product).subscribe(
      (balance) => {
        const bDetail = mapDetailsBalance(balance.details);
        product.balanceDetail = bDetail;
        const tempProd = prods.find(t => t.productNumberX === product.productNumberX);
        tempProd.balanceDetail = product.balanceDetail;
        const tempCard = this._productCards.find(t => t.product.productNumberX === tempProd.productNumberX);
        this.unknownBalanceHandler.updateBalance(tempCard, tempProd);
        this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.CustomerProductList, prods);
        this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.ProductDetail, tempProd);
        load.dismiss();
        this.sendToDetailPage();
      },
      (err) => {
        load.dismiss();
        const tempProd = prods.find(t => t.productNumberX === product.productNumberX);
        this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.ProductDetail, tempProd);
        this.sendToDetailPage();
      }
    );
  }

  sendToDetailPage() {
    this.navCtrl.push('DetailAndTxhistoryPage', null, {
      animate: true,
      animation: 'ios-transition'
    });
  }

  async getApprovedCredit() {
    await new Promise<any>((resolve, reject) => {
      this.crossSell.getApprovedCredit(resolve, reject);
    }).then(value => {
      this.mainCard = null;
      this.approvedCard = value;
      this.mosaicList = this.crossSell.getCrossSellMosaic();
    }).catch(error => { });
  }

  getPrivateMode() {
    const privateModeKey: boolean = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.PrivateMode);
    if (privateModeKey === null || privateModeKey === undefined) {
      this.userFacade.userFeatures$
        .pipe(take(1))
        .subscribe((data: UserFeatures) => {
          this.isPrivateMode = data.settings.privateMode;
        },
          (err) => {
            this.isPrivateMode = false;
          });
    } else {
      this.isPrivateMode = privateModeKey;
    }
  }

  changePrivateMode(ev) {
    this.isPrivateMode = ev.detail;
    this.privateMode.updateKeyPrivateMode(this.isPrivateMode);
    this.userFacade.userFeatures$
      .pipe(take(1))
      .subscribe(userFeatures => {
        userFeatures.settings.privateMode = this.isPrivateMode;
        this.userFacade.updateUserFeaturesData(userFeatures);
      });
  }

  private validateDashboardCampaign(): void {
    const dashCampaigns = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.CampaignsDash);
    this.dashCampaignsService.getCampaignDash(dashCampaigns)
      .subscribe(async campaign => {
        if (!!campaign && !!campaign.campaignCode) {
          this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.CampaignsDash, campaign);
          const modal = await this.pulseModalCtrl.create({
            component: campaign.campaignCode === 1 ? CampaignDashUnicefComponent : CampaignMillionBanquetComponent,
            size: 'large'
          }, this.viewRef, this.resolver);
          await modal.present();
          const { data } = await modal.onWillDismiss();
          if (!!data && !!data.goToDonations) {
            this.goToDonations();
          }
        }
      });
  }

  private goToDonations(): void {
    if (this.productsInquiryFinished) {
      this.validateAccountsToGoDonations();
    } else {
      this.waitProductsInquiryToGoDonations();
    }
  }

  private waitProductsInquiryToGoDonations(): void {
    this.tooltipOps.removeAllTooltip();
    const loading = this.loadingCtrl.create();
    loading.present().then(
      () => {
        this.productsInquiryEmitter
          .pipe(take(1))
          .subscribe(
            (resInquiry: boolean) => {
              if (resInquiry) {
                this.validateAccountsToGoDonations();
              }
              loading.dismiss();
            },
            () => loading.dismiss()
          );
      }
    );
  }

  private validateAccountsToGoDonations(): void {
    this.tooltipOps.removeAllTooltip();
    this.presentTooltips = false;
    const customerProductList: ProductDetail[] = this.selectAccountHandler.getAccountsAvailable(false);
    if (!!customerProductList && customerProductList.length > 0) {
      this.navCtrl.setRoot('DonationsPage', { selectedEntityCode: this.CONST_MILLION_BANQUET_CODE });
    } else {
      this.navCtrl.setRoot('NewTransferMenuPage', { 'tab': 'donations' });
    }
  }

  private getTuPlusPoints() {
    this.tuPlus.getPoints().subscribe(
      (data: TuPlusRs) => {
        this.tuPlusLoader = false;
        this.tuPlusPoints = data.totalPoints;
        this.showTuPlusCard = true;
      },
      (e) => {
        this.tuPlusLoader = false;
        this.showTuPlusCard = false;
      }
    );

  }

  tuPlusDetail() {
    this.navCtrl.push('TuplusDetailPage');
  }


  gotoPocket() {
    if (!this.allowedCreatePocket) {
      this.showErrorModal();
      return;
    }
    this.userFeaturesService.isSettingsFor('onBoardingPockets').subscribe(res => {
      if (res) {
        this.navCtrl.push('PocketGoalPage');
      } else {
        this.navCtrl.push('PocketOnboardingPage');
      }

    });
  }

  gotoPocketDetail(pocket: Pocket) {
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.PocketData, pocket);
    this.navCtrl.push('PocketDetailPage');
  }

  private validateActiveCreditCard(): void {
    const cardActivationRq: CreditCardActivationRq = {
      cardId: this.cardActivation.cardsActivation[0].cardNumber
    };
    this.creditCardFacade.creditCardAccountInfo(cardActivationRq);
    this.creditCardSubscription = this.creditCardFacade.creditCardActivationState$.subscribe(
      ccResponse => {
        if (!!ccResponse.accountInfoSuccess) {
          if (ccResponse.accountInfoSuccess.cardStatusCode === 'N') {
            this.showCreditCardActiveModal(
              'Tu tarjeta ya está activa ',
              'Recuerda que desde mañana podrás ver todos los movimientos de tu tarjeta.'
            );
          } else {
            this.callATCToken();
          }
        }
      }
    );
  }

  private showCreditCardActiveModal(title: string, messageError: string): void {
    this.creditCardFacade.creditCardActivationReset();
    const genericModalData: GenericModalModel = {
      icon: {
        src: 'assets/imgs/payments/message-img.svg',
        alt: 'error'
      },
      modalTitle: title,
      modalInfoData: `<span>${messageError}</span>`,
      actionButtons: [{
        id: 'generic-btn-action-1',
        buttonText: 'Entendido',
        block: true,
        colorgradient: true,
        action: () => {
          this.creditCardSubscription.unsubscribe();
        },
      }]
    };
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }

  public callATCToken() {
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.ActivationCard, this.cardActivation.cardsActivation[0]);
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.ValidateNumberCard, this.cardActivation.cardsActivation[0].lastDigits);
    this.tokenOtp.requestToken(
      this.viewRef,
      this.resolver,
      () => {
        this.navCtrl.push('CardActivationPage');
      },
      'creditCardActivation',
      () => {
        this.creditCardSubscription.unsubscribe();
        this.creditCardFacade.creditCardActivationReset();
      }
    );
  }

  // TODO: cuando se arregle el servicio credit/_search que trae las productos aprobados
  // se debe cambiar la logica para que no le salga a todos la card de seguros
  private async setupCrossSellCards(): Promise<void> {
    this.checkCDTCrossSellCard();
    this.checkPortfolioPurchase();
    await this.getApprovedCredit();
    const hasCCAProduct = !!(this._productCards.find(prCard => prCard.product.category === 'TC'));

    this.crossSell.getLifeInsuranceItem().subscribe((mainCard: CsMainModel) => {
      this.mainCard = mainCard;
      if (!!this.approvedCard && hasCCAProduct) {
        this.crossSell.getLifeInsuranceInMosaic().subscribe(mosaicList => {
          this.mosaicList = mosaicList;
        });

      } else {
        this.mosaicList = this.crossSell.getCrossSellMosaic();
      }
      this.handleCrollSellFiducia();
    }, err => {
      this.mosaicList = this.crossSell.getCrossSellMosaic();
    });
  }

  private checkCDTCrossSellCard(): void {
    const savingAccounts: ProductDetail[] = this.selectAccountHandler.getAccountsByType(false, [BdbConstants.ATH_SAVINGS_ACCOUNT]);
    if (!!savingAccounts && savingAccounts.length > 0) {
      this.crossSell.addCDTCard();
    }
  }

  private checkPortfolioPurchase(): void {
    const hasCCAProduct = !!(this._productCards.find(prCard => prCard.product.category === 'TC'));
    if (!hasCCAProduct) {
      this.crossSell.addPortfolioPurchaseCreditCardItem();
    }
  }

  private async showErrorModal(): Promise<void> {
    const modal = await this.pulseModalCtrl.create({
      component: PocketExceedMaxComponent,
      componentProps: {}
    }, this.viewRef, this.resolver);

    await modal.present();
  }

  private onDigitalCDTClicked(p: PCardModel): void {
    const loading = this.loadingCtrl.create();
    loading.present();
    this.funnelEvent.callFunnel(this._cdt, this._cdt.steps.pickCdt);
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.ProductDetail, p.product);
    this.sendToDetailPage();
    loading.dismiss();
  }
  getTextFromFiduciary(): void {
    this.transactionProvider.getTextFiduciary()
      .subscribe((resp: any) => {
          this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.textFiduciary, resp);
      });
  }

  public hiddenCard(): void {
    this.creditCardFacade.creditCardsToActivateHidden();
    this.creditCardSubscription.unsubscribe();
  }

  public toCamelCase = (str): string => {
    return this.bdbUtilsProvider.toCamelCase(str);
  }

}
