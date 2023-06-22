import { Component, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController, LoadingController } from 'ionic-angular';
import { LimitsRs } from '../../../app/models/limits/get-accounts-limits-response';
import { SummaryHeader, SummaryBody, MobileSummaryProvider } from '../../../components/mobile-summary';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';
import { AccountLimitsRq } from '../../../app/models/limits/get-accounts-limits-request';
import { LimitsProvider } from '../../../providers/limits/limits';
import { ModalSuccess } from '../../../app/models/modal-success';
import { BdbModalProvider } from '../../../providers/bdb-modal/bdb-modal';
import { NavigationProvider } from '../../../providers/navigation/navigation';
import { TokenOtpProvider } from '../../../providers/token-otp/token-otp/token-otp';
import { UpdateLimitsNalAccDelegateService } from '@app/delegate/customer-security-delegate/update-limits-nal-acc-delegate.service';
import {
  ServiceApiErrorModalService
} from '@app/shared/components/modals/service-api-error-modal/provider/service-api-error-modal.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';

@IonicPage({
  segment: 'nat%acct%limits',
  name: 'nat%acct%limits'
})
@Component({
  selector: 'page-nat-acct-limits',
  templateUrl: 'nat-acct-limits.html',
})
export class NatAcctLimitsPage {

  title: string;
  subtitle: string;
  abandonText: string;
  limits: Array<LimitsRs>;
  activeBtnSubmit: boolean;
  headerMobile: SummaryHeader;
  bodyMobile: SummaryBody;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private mobileSummary: MobileSummaryProvider,
    public events: Events,
    private bdbPlatforms: BdbPlatformsProvider,
    public modalCtrl: ModalController,
    private limitsProvider: LimitsProvider,
    private bdbModal: BdbModalProvider,
    private navigation: NavigationProvider,
    private tokenOtp: TokenOtpProvider,
    private updateLimitsNalAccService: UpdateLimitsNalAccDelegateService,
    private loadingCtrl: LoadingController,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private serviceApiErrorModalService: ServiceApiErrorModalService,
  ) {
    this.title = 'Modificar Límite de cuenta nacional';
    this.subtitle = 'Selecciona los topes máximos diarios a modificar';
    this.abandonText = 'Abandonar Límite de cuenta nacional';
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
      try {
        this.limits.forEach(e => {
          if (e.networkOwner === _params.networkOwner) {
            e.amount = _params.amount;
            e.trnCount = _params.trnCount;
            e.edit = !e.edit ? !e.edit : e.edit;
            this.activeBtnSubmit = true;
          }
        });
        const activeLimits = this.limits.filter(e => e.edit).length.toString();
        this.limitsProvider.updateProgressBarStep2('Límite de cuenta nacional', [
          activeLimits
        ]);
        this.bodyMobile = this.limitsProvider.updateMobileSummary('Límite de cuenta nacional', activeLimits);
        resolve();
      } catch (err) {
        reject();
      }
    });
  }

  submitLimits() {
    const accountLimitsRq: AccountLimitsRq = this.bdbInMemory.getItemByKey(InMemoryKeys.AccountLimitsRq);
    this.tokenOtp.requestToken(
      this.viewRef,
      this.resolver,
      () => {
        const loading = this.loadingCtrl.create();
        loading.present().then(() => {
          this.updateLimitsNalAccService
          .limitUpdateNatAcc(accountLimitsRq.accountNumber, accountLimitsRq.accountType, this.limits[0].amount)
          .subscribe(
            res => {
              const dataModal = new ModalSuccess();
              dataModal.title = 'Cambio realizado';
              dataModal.button = 'Finalizar';
              dataModal.content = 'Por seguridad,' +
                ' el tope para <br><br><strong>Límite de cuenta nacional</strong><br><br>Será restablecido al siguiente día hábil';
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
      }, 'limitChangeNationalAccount');
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navigation.onAbandonPressed(this.navCtrl);
  }
}
