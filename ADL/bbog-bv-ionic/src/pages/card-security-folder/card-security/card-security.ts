import { Component, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, PopoverController, PopoverOptions, Platform } from 'ionic-angular';
import { NavigationProvider } from '../../../providers/navigation/navigation';
import { BdbConstants } from '../../../app/models/bdb-generics/bdb-constants';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { CardSecurity } from '../../../app/models/card-security/card-security-list-rs';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BdbMap } from '../../../app/models/bdb-generics/bdb-map';
import { CardSecurityProvider } from '../../../providers/card-security/card-security';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';
import { MobileSummaryProvider } from '../../../components/mobile-summary';
import { CardsSecurtiyRq, CardCardsSecurtiyRq } from '../../../app/models/card-security/cards-securtiy-rq';
import { BdbUtilsProvider } from '../../../providers/bdb-utils/bdb-utils';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { BdbModalProvider } from '../../../providers/bdb-modal/bdb-modal';
import { ModalSuccess } from '../../../app/models/modal-success';
import { BdbRsaProvider } from '../../../providers/bdb-rsa/bdb-rsa';
import { IdType } from '../../../providers/bdb-utils/id-type.enum';
import { EncryptionIdType } from '../../../providers/bdb-utils/encryption-id.enum';
import { TokenOtpProvider } from '../../../providers/token-otp/token-otp/token-otp';
import { CardsInfoFacade } from '../../../new-app/modules/settings/store/facades/cards-info.facade';

@IonicPage({
  name: 'list-card-security',
  segment: 'list-card-security'
})
@Component({
  selector: 'page-card-security',
  templateUrl: 'card-security.html',
})
export class CardSecurityPage {

  title: string;
  subtitle: string;
  abandonText: string;
  validCardSecurityForm = false;
  listCards: Array<CardSecurity>;
  cardSecurityForm: FormGroup;
  listCardsForm: FormArray;
  securityLevelList: Array<Array<BdbMap>> = [];
  typeOfNoveltyList: Array<Array<BdbMap>> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private navigation: NavigationProvider,
    private events: Events,
    private bdbInMemory: BdbInMemoryProvider,
    private formBuilder: FormBuilder,
    private cardSecurity: CardSecurityProvider,
    private loadingCtrl: LoadingController,
    private bdbPlatforms: BdbPlatformsProvider,
    private mobileSummary: MobileSummaryProvider,
    public popoverCtrl: PopoverController,
    private bdbUtils: BdbUtilsProvider,
    private bdbModal: BdbModalProvider,
    private bdbRsa: BdbRsaProvider,
    private platforms: Platform,
    private tokenOtp: TokenOtpProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private cardsInfoFacade: CardsInfoFacade
  ) {

    this.title = 'Seguridad de tarjetas';
    this.subtitle = 'Selecciona la tarjeta para cambiar seguridad';
    this.abandonText = 'Abandonar';

    this.cardSecurityForm = this.formBuilder.group({
      listCardsForm: this.formBuilder.array([])
    });

    this.listCardsForm = this.cardSecurityForm.get('listCardsForm') as FormArray;
    this.listCards = this.bdbInMemory.getItemByKey(InMemoryKeys.ListCardsNormal).map(this.mapList());
  }

  mapList() {
    return (e: CardSecurity, index) => {
      e.nameCard = 'Tarjeta Débito';
      e.logoPath = BdbConstants.BBOG_LOGO_WHITE;
      e.displayNumber = `${e.displayNumber}`;
      e.active = index === 0;

      this.listCardsForm.push(this.createItem());
      this.securityLevelList.push(this.cardSecurity.getSecurityLevel());
      this.typeOfNoveltyList.push([]);
      const group = this.listCardsForm.controls[index] as FormGroup;
      group.controls.securityLevel.valueChanges.subscribe(this.changeSecurityLevel(index, group));
      group.valueChanges.subscribe(this.changeGroup());
      return e;
    };
  }

  changeSecurityLevel(index, group: FormGroup) {
    return (e) => {
      group.controls.typeOfNovelty.setValue('');
      this.typeOfNoveltyList[index] = this.cardSecurity.getTypeOfNovelty().filter(this.cardSecurity.filterTypeOfNovelty(e));
    };
  }

  changeGroup() {
    return (e) => {
      let validate = false;
      this.listCardsForm.controls.forEach((element: FormGroup) => {
        if (element.valid) {
          validate = true;
        }
      });
      this.validCardSecurityForm = validate;
    };
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      securityLevel: ['', [Validators.required]],
      typeOfNovelty: ['', [Validators.required]],
    });
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.mobileSummary.setHeader(null);
    this.mobileSummary.setBody(null);
    this.events.publish('header:title', this.title);
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  selectCard(item: CardSecurity, index: number) {

    if (!this.bdbPlatforms.isBrowser()) {

      const group = this.listCardsForm.controls[index] as FormGroup;

      this.cardSecurity.setUpMobileSummary(item);
      this.navCtrl.push('edit-card-security', {
        item,
        index,
        securityLevel: group.controls.securityLevel.value,
        typeOfNovelty: group.controls.typeOfNovelty.value,
        callback: this.myCallbackFunction
      }, {
        animation: 'ios'
      });

    } else {

      this.listCards.filter(e => e !== item).forEach(e => {
        e.active = false;
      });
      item.active = !item.active;
    }
  }

  myCallbackFunction = (_params) => {
    return new Promise((resolve, reject) => {

      const group = this.listCardsForm.controls[_params.index] as FormGroup;
      group.controls.securityLevel.setValue(_params.securityLevel);
      group.controls.typeOfNovelty.setValue(_params.typeOfNovelty);

      resolve();
    });
  }

  presentPopover(myEvent) {
    const pOptions: PopoverOptions = {
      cssClass: 'info-security'
    };
    const popover = this.popoverCtrl.create('InfoCardSecurityPage', {}, pOptions);
    popover.present({
      ev: myEvent,
      direction: 'right',
      progressAnimation: false
    });
  }

  validateFallBack(value: any): string {

    if (value.securityLevel === '0_1_PSJCardSecLev1' && value.typeOfNovelty === '1_0_PSJKindNoveltySecLev1') {
      return '3';
    } else if (value.securityLevel === '0_0_PSJCardSecLev2' && value.typeOfNovelty === '1_2_PSJKindNoveltySecLev3') {
      return '1';
    }
    return '';
  }

  mapModalError(errors: Array<string>) {

    errors.forEach((e, index) => {
      errors[index] = `<strong>T. Débito No.${e}</strong><br>`;
    });

    this.bdbModal.launchErrModal(
      'Ha ocurrido un error',
      `No se realizo la modificación de seguridad de las siguientes tarjetas:<br><br>${errors.toString().replace(',', '')}<br>Por favor intenta de nuevo`,
      'Aceptar', () => {

      }, null, 'left');
  }

  mapModalSuccess(success: Array<string>) {

    success.forEach((e, index) => {
      success[index] = `<strong>T. Débito No.${e}</strong><br>`;
    });

    const modal = new ModalSuccess();
    modal.title = 'Cambio realizado';
    modal.content = `Se modificó la seguridad de las siguientes tarjetas:<br><br>${success.toString().replace(',', '')}`;
    modal.button = 'Finalizar';

    this.bdbModal.launchSuccessModal(modal, () => {
      if (!this.platforms.is('browser')) {
        this.events.publish('modal:close');
      }
      this.navCtrl.setRoot('DashboardPage');
    });
  }

  submit() {
    this.tokenOtp.requestToken(
      this.viewRef,
      this.resolver,
      () => {
        this.activateCardSecurity();
      });
  }

  activateCardSecurity() {
    const load = this.loadingCtrl.create();

    load.present().then(() => {

      const list = this.cardSecurityForm.get('listCardsForm') as FormArray;
      const observableBatch = [];
      const cardSecurityListValid = [];
      const customer = this.bdbUtils.getCustomer(IdType.BUS_BDB, EncryptionIdType.FULL);

      list.controls.forEach((e: FormGroup, index) => {

        if (e.valid) {
          const card = this.listCards[index];
          const cardCardsSecurtiy = new CardCardsSecurtiyRq();
          cardCardsSecurtiy.cardNumber = this.bdbRsa.encrypt(card.cardNumber);
          cardCardsSecurtiy.cardType = this.bdbRsa.encrypt(card.cardType);

          const cardsSecurtiyRq = new CardsSecurtiyRq();
          cardsSecurtiyRq.customer = customer;
          cardsSecurtiyRq.card = cardCardsSecurtiy;
          cardsSecurtiyRq.fallBack = this.bdbRsa.encrypt(this.validateFallBack(e.value));

          observableBatch.push(this.cardSecurity.cardsSecurtiy(cardsSecurtiyRq).pipe(catchError(error => Observable.of(error))));
          cardSecurityListValid.push(card);
        }
      });

      const forkJoin = Observable.forkJoin(observableBatch);

      forkJoin.subscribe((data) => {

        const errors = [];
        const success = [];

        data.forEach((e: any, index) => {
          if (e.msgType !== undefined && e.msgType === 'success') {
            success.push(cardSecurityListValid[index].displayNumber);
          } else {
            errors.push(cardSecurityListValid[index].displayNumber);
          }
        });

        if (success.length > 0) {
          this.cardsInfoFacade.refreshCardsInfo();
        }

        if (errors.length > 0) {
          this.mapModalError(errors);
        } else {
          this.mapModalSuccess(success);
        }

        load.dismiss();

      });

    });
  }

}
