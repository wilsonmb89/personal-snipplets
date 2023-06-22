import { Component, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ModalOptions, Events, LoadingController } from 'ionic-angular';
import { LimitsRs } from '../../../app/models/limits/get-accounts-limits-response';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';
import { LimitsRq } from '../../../app/models/limits/accounts-limits-update-request';
import { AccountLimitsRq } from '../../../app/models/limits/get-accounts-limits-request';
import { LimitsProvider } from '../../../providers/limits/limits';
import { BdbModalProvider } from '../../../providers/bdb-modal/bdb-modal';
import { ModalSuccess } from '../../../app/models/modal-success';
import { SummaryBody, MobileSummaryProvider, SummaryHeader } from '../../../components/mobile-summary';
import { NavigationProvider } from '../../../providers/navigation/navigation';
import { TokenOtpProvider } from '../../../providers/token-otp/token-otp/token-otp';
import { UpdateLimitsDelegateService } from '@app/delegate/customer-security-delegate/update-limits-delegate.service';
import {
  ServiceApiErrorModalService
} from '@app/shared/components/modals/service-api-error-modal/provider/service-api-error-modal.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';

@IonicPage({
  name: 'limits',
  segment: 'limits'
})
@Component({
  selector: 'page-limits',
  templateUrl: 'limits.html',
})
export class LimitsPage {

  title: string;
  subtitle: string;
  abandonText: string;
  limits: Array<LimitsRs>;
  activeBtnSubmit: boolean;
  headerMobile: SummaryHeader;
  bodyMobile: SummaryBody;
  customOnAbandonPath = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    public modalCtrl: ModalController,
    private bdbPlatforms: BdbPlatformsProvider,
    private limitsProvider: LimitsProvider,
    private bdbModal: BdbModalProvider,
    public events: Events,
    private mobileSummary: MobileSummaryProvider,
    private navigation: NavigationProvider,
    private tokenOtp: TokenOtpProvider,
    private loading: LoadingController,
    private updateLimitsService: UpdateLimitsDelegateService,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private serviceApiErrorModalService: ServiceApiErrorModalService,
  ) {
    this.customOnAbandonPath = navParams.get('customOnAbandonPath');
    this.title = 'Modificar topes';
    this.subtitle = 'Selecciona los topes máximos diarios a modificar';
    this.abandonText = 'Abandonar topes';
    this.activeBtnSubmit = false;

    this.limits = bdbInMemory.getItemByKey(InMemoryKeys.AccountLimits);
    this.limits.forEach(e => {
      e.edit = false;
    });
  }

  ionViewDidLoad() {
    this.headerMobile = this.mobileSummary.getInstance().header;
    this.bodyMobile = this.mobileSummary.getInstance().body;
  }

  ionViewWillEnter() {
    this.mobileSummary.setHeader(this.headerMobile);
    this.mobileSummary.setBody(this.bodyMobile);
    this.events.publish('header:title', this.title);
    this.events.publish('srink', false);
  }

  toggleEdit(limit: LimitsRs) {

    if (!this.bdbPlatforms.isBrowser()) {
      this.mobileSummary.setHeader(null);
      this.mobileSummary.setBody(null);
      this.events.publish('header:title', limit.desc);
      this.navCtrl.push('edit%limit', {
        limit,
        callback: this.myCallbackFunction
      }, {
        animation: 'ios'
      });

    } else {

      const modal = this.modalCtrl.create('edit%limit', {
        limit,
        callback: this.myCallbackFunction
      }, {
        enableBackdropDismiss: false,
        cssClass: 'edit-limit-modal'
      });

      modal.present();
    }

  }

  myCallbackFunction = (_params: LimitsRs) => {
    return new Promise<void>((resolve, reject) => {

      this.limits.forEach(e => {
        if (e.networkOwner === _params.networkOwner) {
          e.amount = _params.amount;
          e.trnCount = _params.trnCount;
          e.edit = !e.edit ? !e.edit : e.edit;
          this.activeBtnSubmit = true;
        }
      });

      const activeLimits = this.limits.filter(e => e.edit).length.toString();

      this.limitsProvider.updateProgressBarStep2('Topes modificados', [
        activeLimits
      ]);
      this.bodyMobile = this.limitsProvider.updateMobileSummary('Topes modificados', activeLimits);
      resolve();
    });

  }

  submitLimits() {

    const limitsUpdate = this.limitsProvider.mapLimitsUpdate(this.limits);
    const accountLimitsRq: AccountLimitsRq = this.bdbInMemory.getItemByKey(InMemoryKeys.AccountLimitsRq);
    this.tokenOtp.requestToken(
      this.viewRef,
      this.resolver,
      () => {
        const loading = this.loading.create();
        loading.present().then(() => {
          const limitsApiUpdate = this.limits.filter(limit => !!limit.edit);
          this.updateLimitsService
            .limitUpdate(accountLimitsRq.accountNumber, accountLimitsRq.accountType, limitsApiUpdate)
            .subscribe(
              res => {
                const dataModal = new ModalSuccess();
                dataModal.title = 'Cambio realizado';
                dataModal.button = 'Finalizar';
                dataModal.content = this.mapContentSuccess(limitsUpdate);
                loading.dismiss();
                this.bdbModal.launchSuccessModal(dataModal, () => {
                  this.events.publish('modal:close');
                  this.events.publish('srink', false);
                  this.navCtrl.popToRoot();
                });
              },
              (ex) => {
                loading.dismiss();
                const errorData: ApiGatewayError = ex.error ? ex.error : null;
                this.serviceApiErrorModalService.launchErrorModal(
                  this.viewRef,
                  this.resolver,
                  !!errorData ? errorData.customerErrorMessage : null
                );
              }
            );
        });
      },
      'limitChanges'
      );
  }

  mapContentSuccess(limitsUpdate: Array<LimitsRq>): string {

    const normalLimits: Array<LimitsRq> = limitsUpdate.filter(e => {
      return e.networkOwner !== 'AVP' && e.networkOwner !== 'CTD';
    });

    const resetLimits: Array<LimitsRq> = limitsUpdate.filter(e => {
      return e.networkOwner === 'AVP' || e.networkOwner === 'CTD';
    });

    const normalStr = normalLimits.length === 0 ? '' : this.mapNormalStr(normalLimits);
    const restoreStr = resetLimits.length === 0 ? '' : this.mapRestoreStr(resetLimits, normalLimits);

    return `${normalStr} ${restoreStr}`;
  }

  mapNormalStr(normalLimits: Array<LimitsRq>): string {

    let str = 'El tope para <strong>';
    const replacement = ' y';

    normalLimits.forEach((e: LimitsRs) => {
      str += ` ${e.desc},`;
    });

    str = str.replace(/.$/, '');
    str = str.replace(/,([^,]*)$/, replacement + '$1');

    str += normalLimits.length === 1 ? '</strong> ha sido modificado.<br>' : '</strong> han sido modificados.<br>';

    return `${str}<br>`;
  }

  mapRestoreStr(resetLimits: Array<LimitsRq>, normalLimits: Array<LimitsRq>): string {

    let str = normalLimits.length === 0 ? 'Por seguridad al finalizar el día, el tope para:<br><br> <strong>' : '<strong>';

    resetLimits.forEach((e: LimitsRs) => {
      str += ` ${e.desc}<br>`;
    });

    str += '</strong><br>Será restablecido a $100.000 y 5 transacciones.' +
      ' Si el tope que haz hecho es inferior a $100.000, no será modificado.';

    return str;
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    if (!!this.customOnAbandonPath) {
      this.navCtrl.setRoot(this.customOnAbandonPath);
    } else {
      this.navigation.onAbandonPressed(this.navCtrl);
    }
  }
}
