import { Events, IonicPage, Loading, LoadingController, ModalController, NavController, Platform, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ENV } from '@app/env';

import { PageTrack } from '../../app/core/decorators/AnalyticTrack';
import { CustomerCard } from '../../app/models/activation-cards/customer-cards-list-rs';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';
import { ProductDetail } from '../../app/models/products/product-model';
import { MobileSummaryProvider } from '../../components/mobile-summary';
import { SessionProvider } from '../../providers/authenticator/session';
import { BdbFingerPrintProvider } from '../../providers/bdb-finger-print/bdb-finger-print';
import { BdbInMemoryIonicProvider } from '../../providers/bdb-in-memory-ionic/bdb-in-memory-ionic';
import { BdbModalProvider } from '../../providers/bdb-modal/bdb-modal';
import { FilterUtilsProvider } from '../../providers/filter-utils/filter-utils';
import { FunnelEventsProvider } from '../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../providers/funnel-keys/funnel-keys';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { SettingsMenuProvider } from '../../providers/settings-menu/settings-menu';
import { CardsInfoFacade } from '../../new-app/modules/settings/store/facades/cards-info.facade';
import { BdbAppVersionService } from '@app/shared/utils/bdb-app-version-service/bdb-app-version.service';
import { GenerateAccessTokenDelegateService } from '@app/delegate/identity-validation-delegate/generate-access-token-delegate.service';
import { BdbPlatformsProvider } from '../../providers/bdb-platforms/bdb-platforms';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { UserFeatures } from '@app/apis/user-features/models/UserFeatures';
import { CardsInfoState } from '@app/modules/settings/store/states/cards-info.state';
import { IdentificationTypeListProvider } from '../../providers/identification-type-list-service/identification-type-list-service';
import { take } from 'rxjs/operators';
import { GetAllBasicDataDelegateService } from '@app/delegate/customer-basic-data-delegate/get-all-delegate.service';
import { BdbMicrofrontendEventsService } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';

@PageTrack({ title: 'settings-app' })
@IonicPage({
  name: 'settings%app',
  segment: 'settings-app'
})
@Component({
  selector: 'settings-app',
  templateUrl: 'settings.html'
})

export class SettingsPage {

  private readonly VALID_IDENTIFICATION_TYPES: string[] = ['CC', 'CE', 'RC', 'NJ', 'PA', 'TI', 'NI', 'NE'];
  private readonly CARD_TYPE_PRIV: string = 'PRIV';

  setting: any;
  title = 'Seguridad';
  itemsMenu: BdbMap[];
  isApp: boolean;
  validAccountsToPay: Array<ProductDetail> = [];
  appVersion$: Observable<string>;

  private _menu = this.funnelKeysProvider.getKeys().menu;
  private avaliableItemsSubs: Subscription;

  constructor(
    private fingerPrintProvider: BdbFingerPrintProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private toastCtrl: ToastController,
    public navCtrl: NavController,
    private ionicStorage: BdbInMemoryIonicProvider,
    private modalCtrl: ModalController,
    private mobileSummary: MobileSummaryProvider,
    public plt: Platform,
    private events: Events,
    private loadingCtrl: LoadingController,
    private bdbModal: BdbModalProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private filterUtils: FilterUtilsProvider,
    private menu: SettingsMenuProvider,
    private cardsInfoFacade: CardsInfoFacade,
    private userFacade: UserFacade,
    private appVersionService: BdbAppVersionService,
    private generateAccessTokenService: GenerateAccessTokenDelegateService,
    private bdbPlatforms: BdbPlatformsProvider,
    private iab: InAppBrowser,
    private identificationTypeListProvider: IdentificationTypeListProvider,
    private getAllDelegateService: GetAllBasicDataDelegateService,
    private bdbMicrofrontendEventsService: BdbMicrofrontendEventsService
  ) {
    this.isApp = !plt.is('core') && !plt.is('mobileweb');
    const customerProducts = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    if (customerProducts) {
      this.validAccountsToPay = customerProducts.filter(this.filterUtils.getValidAccountsToPay());
    }

    this.setting = {
      'fingerEnabled': true,
      'checked': false
    };

    this.ionicStorage.get(InMemoryKeys.ShowFingerInHome).then((data) => {
      if (data) {
        this.setting = {
          'checked': true,
        };

      } else {
        this.setting = {
          'checked': false,
        };
      }
    }).catch((error) => {
      this.setting = {
        'checked': false,
      };
    });

    this.cardsInfoFacade.fetchCardsInfo();
    this.events.publish('menu:active', 'settings%app');
    this.events.publish('srink', false);
    this.appVersion$ = this.appVersionService.appVersion$;
  }

  ionViewDidLoad() {
    this.funnelEventsProvider.callFunnel(this._menu, this._menu.steps.configuration);
  }

  ionViewWillEnter() {
    this.getItemsMenu();
    this.events.publish('header:title', 'Configuración');
    this.mobileSummary.setBody(null);
    this.mobileSummary.setHeader(null);
  }

  ionViewWillLeave() {
    if (!!this.avaliableItemsSubs) {
      this.avaliableItemsSubs.unsubscribe();
    }
  }

  itemSelected(page: BdbMap) {
    if (page.microfrontend) {
      this.bdbMicrofrontendEventsService.sendRouteEventToParentWindow('/settings/accounts');
      return;
    }
    const load = this.loadingCtrl.create();

    // si la opcion seleccionada es
    // actualizacion de datos o Activación de Tarjetas
    // consultamos el web service antes de redirigir
    switch (page.key) {
      case 'pqrInquiry':
        load.present().then(() => {
          this.validateAccessToken(load);
        });
        break;
      case 'custManagement':
        load.present().then(() => {
          this.getAllDelegateService.getAllBasicDataDelegate().subscribe(
            userData => {
              this.bdbInMemory.setItemByKey(InMemoryKeys.CustomerInfo, userData);
              load.dismiss();
              this.navigate(page);
            },
            () => {
              load.dismiss();
              this.bdbModal.launchErrModal(
                'Error',
                'Error al consultar la información. Intente de nuevo',
                'Aceptar'
              );
            }
          );
        });
        break;
      default:
        this.navigate(page);
        break;
    }
  }

  /* navigate */
  navigate(page: BdbMap) {
    this.navCtrl.push(page.template);
  }

  public updateFinger() {
    if (!this.setting.fingerEnabled) {
      this.fingerPrintProvider.delete(this.bdbInMemory.getItemByKey(InMemoryKeys.DeviceId)).subscribe(
        (data) => {
          this.ionicStorage.set(InMemoryKeys.ShowFingerInHome, false);
          this.showToast('Touch ID se ha deshabilitado!');
        },
        (err) => {
          this.showToast('Fallo deshabilitado el Touch ID');
        });
    } else {
      const modal = this.modalCtrl.create('FingerPrintAlertPage');
      modal.present();
    }
  }

  private showToast(title: string) {
    const toast = this.toastCtrl.create({
      message: title,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }

  logout() {
    this.events.publish('modal:close');
    this.navCtrl.push('authentication/logout');
  }

  filterCardsActivation(customerCardsList) {
    const debitCard: Array<CustomerCard> = customerCardsList.filter(e => e.cardType === 'DEB' && e.cardState === 'E');
    const creditCard = customerCardsList.filter(e => e.cardType === 'CRE' && e.cardState === '4');
    const cardsActivation = debitCard.concat(creditCard);
    if (cardsActivation.length > 0) {
      this.itemsMenu.forEach(e => {
        if (e.key === 'activationCards') {
          e.enabled = true;
        }
      });
    }
    this.bdbInMemory.setItemByKey(InMemoryKeys.ListCardsActivate, cardsActivation);
  }

  private filterDebitCardsNormal(customerCardsList: CustomerCard[]): void {
    const debitCard: Array<CustomerCard> = customerCardsList.filter(e => e.cardType === 'DEB' && e.cardState === 'N');
    if (debitCard.length > 0) {
      this.itemsMenu.forEach(e => {
        if (e.key === 'cardSecurity') {
          e.enabled = true;
        }
      });
    }
    this.bdbInMemory.setItemByKey(InMemoryKeys.ListCardsNormal, debitCard);
  }

  private filterCardsLock(customerCardsList: CustomerCard[]): void {
    const debitCard: Array<CustomerCard> = customerCardsList.filter(e => e.cardType === 'DEB' && e.cardState !== 'E');
    const creditCard: Array<CustomerCard> = customerCardsList.filter(e => e.cardType === 'CRE' && e.cardState !== '4');
    const customerProductList = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    const creditAvailable: CustomerCard[] = [];
    creditCard.forEach((card: CustomerCard) => {
      const productCard = customerProductList.find(product => product.productNumberApi === card.cardNumber);
      if (!!productCard) {
        creditAvailable.push(card);
      }
    });
    const cardsAvailable = debitCard.concat(creditAvailable);
    if (cardsAvailable.length > 0) {
      this.itemsMenu.forEach(e => {
        if (e.key === 'debitCardLock') {
          e.enabled = true;
        }
      });
    }
    this.bdbInMemory.setItemByKey(InMemoryKeys.ListCardLock, cardsAvailable);
  }

  private validateStoredCards(cardsInfoState: CardsInfoState): void {
    if (!cardsInfoState.working) {
      this.disableMenuItems();
      const customerCards = cardsInfoState.customerCardList;
      if (cardsInfoState.completed && !!customerCards && customerCards.length > 0) {
        this.filterCardsActivation(customerCards);
        this.filterDebitCardsNormal(customerCards);
        this.filterCardsLock(customerCards);
      }
    }
  }

  private disableMenuItems(): void {
    this.itemsMenu.forEach(a => {
      if (a.key === 'activationCards' || a.key === 'cardSecurity' || a.key === 'debitCardLock') {
        a.enabled = false;
      }
    });
  }

  private getItemsMenu(): void {
    this.itemsMenu = this.menu.getSettingsMenu(this.validAccountsToPay.length > 0);
    const load = this.loadingCtrl.create();
    this.avaliableItemsSubs = combineLatest(
      this.userFacade.userFeatures$,
      this.cardsInfoFacade.cardsInfoState$
    )
    .pipe(take(1))
    .subscribe(
      ([userFeature, cardsInfoState]: [UserFeatures, CardsInfoState]) => {
        this.validateStoredCards(cardsInfoState);
        this.validateAllowedOptions(userFeature, cardsInfoState);
        load.dismiss();

      },
      err => {
        this.bdbModal.launchErrModal(
          'Error',
          'Error al consultar la información. Intente de nuevo',
          'Aceptar'
        );
      }
    );
  }

  private validateAllowedOptions(userFeature: UserFeatures, cardsInfoState: CardsInfoState): void {
    if (!!this.itemsMenu && (!userFeature.toggle.allowedServices.pqrInquiry || this.identificationTypeListProvider.isLegalPerson())) {
      this.itemsMenu = this.itemsMenu.filter(setting => setting.key !== 'pqrInquiry');
    }
    const safeKeyFound = !!(cardsInfoState.customerCardList.find(card => card.cardType === this.CARD_TYPE_PRIV));
    const validIdentificationType = !this.checkValidIdentificationTypes(userFeature.customer.identificationType);
    if (userFeature.toggle.allowedServices.enableSetCardPin && validIdentificationType && !safeKeyFound) {
      this.itemsMenu.find(setting => setting.key === 'changePass').enabled = false;
    } else if (!userFeature.toggle.allowedServices.enableSetCardPin) {
      this.itemsMenu = this.itemsMenu.filter(setting => setting.key !== 'changePass');
    }
    if (!!this.itemsMenu && !userFeature.toggle.allowedServices.cardsSecurity) {
      this.itemsMenu = this.itemsMenu.filter(setting => setting.key !== 'cardSecurity');
    }
  }

  private validateAccessToken(load: Loading): void {
    this.generateAccessTokenService.generateAccessToken()
    .subscribe(
      (accessToken) => {
        load.dismiss();
        if (!!accessToken.uuid) {
          this.redirect(ENV.PQR_POSTAUTH.concat(accessToken.uuid));
        }
      },
      err => {
        load.dismiss();
        this.bdbModal.launchErrModal(
          'Error',
          'Error al consultar la información. Intente de nuevo',
          'Aceptar'
        );
      }
    );
  }

  private redirect(url: string): void {
    if (this.bdbPlatforms.isApp()) {
      this.iab.create(url).show();
    } else {
      window.open(url, '_blank');
    }
  }

  private checkValidIdentificationTypes(identificationType: string): boolean {
    return this.VALID_IDENTIFICATION_TYPES.indexOf(identificationType) !== -1;
  }

}
