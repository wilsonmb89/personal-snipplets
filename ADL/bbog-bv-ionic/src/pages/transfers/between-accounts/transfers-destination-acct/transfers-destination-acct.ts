import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Events, LoadingController, NavController, NavParams, IonicPage } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { Customer } from '../../../../app/models/bdb-generics/customer';
import { AccountAny } from '../../../../app/models/enrolled-transfer/account-any';
import { AccountBalance } from '../../../../app/models/enrolled-transfer/account-balance';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { Favorite } from '../../../../app/models/social/favorite';
import { TransferInfo } from '../../../../app/models/transfers/transfer-info';
import { MobileSummaryProvider } from '../../../../components/mobile-summary';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { BdbFavoritesProvider } from '../../../../providers/bdb-favorites/bdb-favorites';
import { BdbModalProvider } from '../../../../providers/bdb-modal/bdb-modal';
import { BdbToastProvider } from '../../../../providers/bdb-toast/bdb-toast';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { EncryptionIdType } from '../../../../providers/bdb-utils/encryption-id.enum';
import { IdType } from '../../../../providers/bdb-utils/id-type.enum';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { TokenOtpProvider } from '../../../../providers/token-otp/token-otp/token-otp';
import { AccountsDelegateService } from '@app/delegate/accounts-delegate/accounts-delegate.service';
import { TransfersDelegateService } from '@app/delegate/transfers-delegate/transfers-delegate.service';
import { SelectAccountHandlerProvider } from '../../../../providers/select-account-handler/select-account-handler';
import { GenericModalService } from '../../../../new-app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { GenericModalModel } from '../../../../new-app/shared/components/modals/generic-modal/model/generic-modal.model';
import { BdbMicrofrontendEventsService } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';
import { TargetAccountState } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.types';
import { UserFeaturesDelegateService } from '../../../../new-app/core/services-delegate/user-features/user-features-delegate.service';
import { take } from 'rxjs/operators';
import { PulseToastOptions } from '@app/shared/components/pulse-toast/model/generic-toast.model';
import { PulseToastService } from '@app/shared/components/pulse-toast/provider/pulse-toast.service';

@PageTrack({ title: 'transfers-destination-acct' })
@IonicPage({
  name: 'transfer%destination',
  segment: 'transfer-destination'
})
@Component({
  selector: 'page-transfers-destination-acct',
  templateUrl: 'transfers-destination-acct.html',
})
export class TransfersDestinationAcctPage implements OnInit {

  title = 'Transferencias';
  subtitle = 'Selecciona la cuenta de destino';
  acctSelected: ProductDetail;
  customer: Customer;

  // tslint:disable-next-line:max-line-length
  accountsCards: Array<{ logoPath, contraction, cardTitle, cardDesc, cardSubDesc, account, avatarColor, showLogo, favorite, favoriteTime }> = [];
  // tslint:disable-next-line:max-line-length
  enrolledAccountsCards: Array<{ logoPath, contraction, cardTitle, cardDesc, cardSubDesc, account, avatarColor, showLogo, favorite, favoriteTime }> = [];
  alldAccounts: Array<{
    logoPath, contraction, cardTitle, cardDesc, cardSubDesc,
    account, avatarColor, showLogo, favorite, favoriteTime
  }> = [];

  private _funnel = this.funnelKeysProvider.getKeys().transfers;
  private _funnelEnroll = this.funnelKeysProvider.getKeys().enrollAccounts;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private loadingCtrl: LoadingController,
    private bdbUtils: BdbUtilsProvider,
    private progressBar: ProgressBarProvider,
    private bdbModal: BdbModalProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private accessDetail: AccessDetailProvider,
    private mobileSummary: MobileSummaryProvider,
    private favoriteProvider: BdbFavoritesProvider,
    private bdbToast: BdbToastProvider,
    private events: Events,
    private tokenOtp: TokenOtpProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private accountsDelegateService: AccountsDelegateService,
    private transfersDelegateService: TransfersDelegateService,
    private selectAccountHandler: SelectAccountHandlerProvider,
    private genericModalService: GenericModalService,
    private microfrontendService: BdbMicrofrontendEventsService,
    private userFeaturesService: UserFeaturesDelegateService,
    private pulseToastService: PulseToastService
  ) {
    this.customer = this.bdbUtils.getCustomer(IdType.BUS_BDB, EncryptionIdType.NONE);
  }

  ngOnInit() {
    this.loadAllAccounts();

    /* si tiene una sola cuenta, se vacia el array para no mostrar en pantalla */
    if (this.accountsCards.length === 1) {
      this.accountsCards = [];
    }
    this.setUpProgressBar();
    this.mobileSummary.setHeader(null);
    this.mobileSummary.setBody(null);
    this.events.publish('header:btn:remove', 'left');
  }

  ionViewWillLeave() {
    this.events.publish('header:btn:add');
  }

  loadAllAccounts() {
    this.alldAccounts = [];
    this.getAccounts();
    this.getEnrolledAccounts();
  }

  sortFavorites() {
    this.alldAccounts = this.accountsCards.concat(this.enrolledAccountsCards);
    this.alldAccounts.sort((v1, v2) => v1.favoriteTime - v2.favoriteTime);
    const first = this.alldAccounts.filter(t => t.favorite);
    const second = this.accountsCards.filter(t => !t.favorite);
    const third = this.enrolledAccountsCards.filter(t => !t.favorite);
    this.alldAccounts = [];
    this.alldAccounts = first.concat(second).concat(third);
  }

  getAccounts() {
    const customerProducts: ProductDetail[] = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    if (customerProducts) {
      this.userFeaturesService.isAllowedServiceFor('scheduledTransfers')
      .pipe(take(1))
      .subscribe((isScheduledTransfersActive) => {
        this.accountsCards = customerProducts.filter(e => {
          if (this.accessDetail.isOriginSelected()) {
            if (this.accessDetail.getOriginSelected().productNumber === e.productNumber) {
              this.accessDetail.updateProgressBarDone(e);
              return null;
            }
          }
          const isSavingAccount = e.productType === BdbConstants.ATH_SAVINGS_ACCOUNT;
          const isCheckAccount = e.productType === BdbConstants.ATH_CHECK_ACCOUNT;
          return (isSavingAccount || isCheckAccount);
        }).map((e: ProductDetail, index, productsDetailArray) => {
          const pName = e.productType === BdbConstants.ATH_SAVINGS_ACCOUNT ? 'Ahorros' : 'Corriente';
          const configuration = {
            logoPath: BdbConstants.BBOG_LOGO_WHITE,
            contraction: '',
            cardTitle: e.productName,
            cardDesc: [
              `${pName} No. ${e.productNumber}`
            ],
            cardSubDesc: [
              e.productBank
            ],
            account: e,
            avatarColor: '',
            showLogo: true,
            withFavoriteStar: false,
            favorite: false,
            favoriteTime: undefined,
            contextMenuList: [
              { key: 'transfer-own-account', value: 'Transferir', color: 'carbon', colorvariant: '700', showIcon: false }
            ],
          };
          if (isScheduledTransfersActive && productsDetailArray.length > 1) {
            configuration.contextMenuList.push(
              { key: 'scheduled', value: 'Programar transferencia', color: 'carbon', colorvariant: '700', showIcon: false }
            );
          }
          return configuration;
        });
        this.sortFavorites();
      });
    } else {
      this.sortFavorites();
    }
  }

  getEnrolledAccounts() {
    const enrAcct = this.bdbInMemory.getItemByKey(InMemoryKeys.EnrolledAccountsList);
    if (!!enrAcct) {
      this.mapEnrolledAccounts(enrAcct);
    } else {
      const loading = this.loadingCtrl.create();
      loading.present().then(() => {
        this.transfersDelegateService.getAffiliatedAccounts().subscribe(
          (data: AccountBalance[]) => {
            this.mapEnrolledAccounts(data);
            loading.dismiss();
          },
          err => {
            loading.dismiss();
          });
      });
    }
  }

  setUpProgressBar() {
    this.progressBar.resetObject();
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Cuenta Destino');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Valor a transferir');
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, ['']);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, false);
    if (this.accessDetail.isOriginSelected()) {
      this.accessDetail.updateProgressBarDone(this.accessDetail.getOriginSelected());
    }
  }

  public triggerAmmt(account, type): void {
    if (type) {
      this.triggerAmmtInput(account);
    } else {
      this.triggerAmmtInputEnroll(account);
    }
  }

  private triggerAmmtInput(account: ProductDetail): void {
    if (this.validateTransferAccounts(true, account.productNumber)) {
      this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.pickAccount);
      const accountAny: AccountAny = new AccountAny(true, account, null);
      this.processSelection(accountAny);
    }
  }

  private triggerAmmtInputEnroll(account: AccountBalance): void {
    if (this.validateTransferAccounts(false, account.productNumber)) {
      this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.pickAccount);
      const accountAny: AccountAny = new AccountAny(false, null, account);
      this.processSelection(accountAny);
    }
  }

  private validateTransferAccounts(owned: boolean, productNumber: string): boolean {
    const customerProducts: ProductDetail[] = this.selectAccountHandler.getAccountsAvailable(false);
    const ownedAccountTo = customerProducts.find(prod => prod.productNumber === productNumber);
    if (this.validateOriginAccounts(ownedAccountTo)) {
      return this.validateBalanceAccounts(owned, customerProducts, productNumber);
    } else {
      this.launchErrorModal(
        'assets/imgs/generic-modal/icon-error-acct.svg',
        'Selecciona otra cuenta',
        'No tienes cuentas adicionales en Banco de Bogotá para transferir a esta cuenta.',
        'Entendido'
      );
      return false;
    }
  }

  private validateBalanceAccounts(owned: boolean, customerProducts: ProductDetail[], productNumber: string): boolean {
    const validProducts = this.getAvaliableProds(owned, customerProducts, productNumber);
    if (validProducts.length === 0) {
      this.launchErrorModal(
        'assets/imgs/generic-modal/icon-error-fondos.svg',
        'Fondos insuficientes',
        'No tienes saldo suficiente para realizar la transacción.',
        'Entendido');
      return false;
    }
    return true;
  }

  private getAvaliableProds(owned: boolean, customerProducts: ProductDetail[], productNumber: string): ProductDetail[] {
    let validProducts: ProductDetail[] = [];
    if (customerProducts) {
      validProducts =
        owned ?
          customerProducts.filter(
            prod => prod.productNumber !== productNumber && (prod.amount > 0 || prod.productTypeBDB === BdbConstants.CHECK_ACCOUNT)
          ) :
          customerProducts.filter(prod => prod.amount > 0 || prod.productTypeBDB === BdbConstants.CHECK_ACCOUNT);
    }
    return validProducts;
  }

  private validateOriginAccounts(ownedAccountTo: ProductDetail): boolean {
    const validOriginAccounts = !!ownedAccountTo ?
      this.selectAccountHandler.getAccountsAvailable(false, false, ownedAccountTo) :
      this.selectAccountHandler.getAccountsAvailable(false);
    return !!validOriginAccounts && validOriginAccounts.length > 0;
  }

  private launchErrorModal(
    imgSrcPath: string,
    title: string,
    description: string,
    actionText: string
  ): void {
    const genericModalData: GenericModalModel = {
      icon: {
        src: imgSrcPath,
        alt: 'error'
      },
      modalTitle: title,
      modalInfoData: `<span>${description}</span>`,
      actionButtons: [
        {
          id: 'generic-btn-action-1',
          buttonText: actionText,
          block: true,
          colorgradient: true,
          action: () => { }
        }
      ]
    };
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }

  processSelection(account: AccountAny) {
    const transferInfo: TransferInfo = new TransferInfo();
    if (account.owned || account.accountEnrolled.aval) {
      transferInfo.isAval = true;
      transferInfo.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
    } else {
      transferInfo.isAval = false;
      transferInfo.transactionCost = BdbConstants.TRANSACTION_COST.ACH_TRANSFER;
    }
    transferInfo.accountTo = account;
    transferInfo.idempotencyKey = UUID.UUID();
    this.bdbInMemory.setItemByKey(InMemoryKeys.TransferInfo, transferInfo);

    this.navCtrl.push('amount%input', {}, {
      animate: true,
      direction: 'forward'
    });
  }

  enrollAcct() {
    this.funnelEventsProvider.callFunnel(this._funnelEnroll, this._funnelEnroll.steps.pickEnroll);
    this.tokenOtp.requestToken(
      this.viewRef,
      this.resolver,
      () => {
          this.navCtrl.push('subscribe%acct%data');
      },
      'accountInscription');
  }

  onAbandon() {
    this.navCtrl.popToRoot();
  }

  onContextSelection(event, account: AccountBalance) {
    if (event.key === 'delete') {
      this.bdbModal.launchErrModal(
        'Eliminar cuenta',
        'Si lo haces, deberás inscribirla nuevamente para realizar transferencias.',
        'Eliminar',
        (data) => {
          if (data === 'Eliminar') {
            const loading = this.loadingCtrl.create();
            loading.present().then(() => {
              this.accountsDelegateService.deleteAccount(account).subscribe(
                async res => {
                  this.deleteAccount(account);
                  loading.dismiss();

                  const opts: PulseToastOptions = {
                    text: 'La cuenta se ha eliminado correctamente',
                    color: 'success',
                    colorvariant: '100',
                    image : 'assets/imgs/pulse-toast/toast-delete.svg',
                    closeable : true,
                  };
                  await this.pulseToastService.create(opts);
                },
                error => {
                  loading.dismiss();
                  this.bdbModal.launchErrModal(
                    'No se pudo eliminar el producto',
                    'Por favor intenta de nuevo más tarde',
                    'Aceptar');
                }
              );
            });
          }
        },
        'Cancelar');
    } else if (event.key === 'scheduled') {
      this.microfrontendService.saveStateInSessionStorage<TargetAccountState>(
        'TargetAccountState',
        this.mapToScheduledTransfer(account)
      );
      this.microfrontendService.sendRouteEventToParentWindow('/transferencias/programadas/crear');
    } else if (event.key === 'transfer-own-account') {
      this.triggerAmmtInput(account as any);
    } else if (event.key === 'transfer-other-account') {
      this.triggerAmmtInputEnroll(account);
    }
  }

  private mapToScheduledTransfer(account: AccountBalance): TargetAccountState {
    const acctMapper = account['productDetailApi'];
    if (acctMapper) {
      return {
        accountAlias: acctMapper.productName,
        accountType: acctMapper.productBankType,
        accountId: acctMapper.productNumber,
        bankId: BdbConstants.BBOG,
        bankName: account.productBank,
        isAval: !!account['isAval']
      };
    } else {
      return {
        accountAlias: account.productName || account.productAlias,
        accountType: account.productType,
        accountId: account.productNumber,
        bankId: account.bankId,
        bankName: account.productBank,
        isAval: account.aval
      };
    }
  }

  deleteAccount(account: AccountBalance) {
    const enrAccounts: AccountBalance[] = this.bdbInMemory.getItemByKey(InMemoryKeys.EnrolledAccountsList);
    const filtered = enrAccounts.filter(obj => {
      return obj.productNumber !== account.productNumber;
    });
    this.bdbInMemory.setItemByKey(InMemoryKeys.EnrolledAccountsList, filtered);
    this.enrolledAccountsCards = [];
    this.getAccounts();
    this.mapEnrolledAccounts(filtered);
  }

  public actionFavorite(item) {
    const favorite: Favorite = new Favorite();
    favorite.identification = this.customer.identificationType + this.customer.identificationNumber;
    favorite.item = item.account.productNumber;
    favorite.kind = 'TR';
    const productNumberFav = item.account.productNumber;
    const productCard = this.enrolledAccountsCards.find(k => {
      return k.account.productNumber.match(favorite.item);
    });

    const ownedCard = this.accountsCards.find(k => {
      return k.account.productNumber.match(favorite.item);
    });
    const d = new Date();
    item.favorite = !item.favorite;
    if (item.favorite) {
      favorite.creationDate = d.getTime();
      d.setHours(d.getHours() - 2);
      this.favoriteProvider.addFav(favorite).subscribe(result => {
        if (productCard) {
          productCard.favorite = item.favorite;
          productCard.favoriteTime = d.getTime();
          this.enrolledAccountsCards.sort((v1, v2) => v1.favoriteTime - v2.favoriteTime);
          this.updateEnrolledAccounts(productCard, productNumberFav);
        } else {
          ownedCard.favorite = item.favorite;
          ownedCard.favoriteTime = d.getTime();
          this.accountsCards.sort((v1, v2) => v1.favoriteTime - v2.favoriteTime);
          this.updateOwnAccounts(ownedCard, productNumberFav);
        }
      }, error => {
        this.bdbToast.showToast('Problemas agregando cuenta a favoritos');
        item.favorite = false;
      });
    } else {
      favorite.creationDate = item.account.favoriteTime;
      this.favoriteProvider.delFav(favorite).subscribe(result => {
        if (productCard) {
          productCard.favorite = false;
          productCard.favoriteTime = d.getTime();
          this.enrolledAccountsCards.sort((v1, v2) => v1.favoriteTime - v2.favoriteTime);
          this.updateEnrolledAccounts(productCard, productNumberFav);
        } else {
          d.setHours(d.getHours() - 1);
          ownedCard.favorite = false;
          ownedCard.favoriteTime = d.getTime();
          this.accountsCards.sort((v1, v2) => v1.favoriteTime - v2.favoriteTime);
          this.updateOwnAccounts(ownedCard, productNumberFav);
        }
      }, error => {
        this.bdbToast.showToast('Problemas en eliminación de favorito');
        item.favorite = true;
      });
    }
  }

  updateOwnAccounts(ownedCard, productNumberFav) {
    const acct: ProductDetail[] = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    const a = acct.find((hdas: ProductDetail) => {
      return hdas.productNumber === productNumberFav;
    });
    a.favorite = ownedCard.favorite;
    a.favoriteTime = ownedCard.favoriteTime;
    this.bdbInMemory.setItemByKey(InMemoryKeys.CustomerProductList, acct);
  }

  updateEnrolledAccounts(productCard, productNumberFav) {
    const enrAcct: AccountBalance[] = this.bdbInMemory.getItemByKey(InMemoryKeys.EnrolledAccountsList);
    const a = enrAcct.find((hdas: AccountBalance) => {
      return hdas.productNumber === productNumberFav;
    });
    a.favorite = productCard.favorite;
    a.favoriteTime = productCard.favoriteTime;
    this.bdbInMemory.setItemByKey(InMemoryKeys.EnrolledAccountsList, enrAcct);
  }

  private mapEnrolledAccounts(data: AccountBalance[]) {
    this.userFeaturesService.isAllowedServiceFor('scheduledTransfers')
      .pipe(take(1))
      .subscribe((isScheduledTransfersActive) => {
        this.enrolledAccountsCards = data.map((e: AccountBalance, index) => {
          const pName = e.productType === BdbConstants.SAVINGS_ACCOUNT ? 'Ahorros' : 'Corriente';
          const configuration =  {
            logoPath: null,
            contraction: e.contraction,
            cardTitle: e.productAlias,
            cardDesc: [
              `${pName} No. ${e.productNumber}`
            ],
            cardSubDesc: [
              `${e.productBank}`
            ],
            account: e,
            avatarColor: this.bdbUtils.getRandomColor(index),
            showLogo: false,
            withFavoriteStar: true,
            favorite: e.favorite,
            favoriteTime: e.favoriteTime,
            contextMenuList: [
              { key: 'transfer-other-account', value: 'Transferir', color: 'carbon', colorvariant: '700', showIcon: false },
              { key: 'delete', value: 'Eliminar Cuenta', color: 'error', colorvariant: '700', showIcon: false },
            ],
          };
          if (isScheduledTransfersActive) {
            configuration.contextMenuList.splice(1, 0, { key: 'scheduled', value: 'Programar Transferencia', color: 'carbon', colorvariant: '700', showIcon: false });
          }
          return configuration;
        });
        this.sortFavorites();
      });
  }

}
