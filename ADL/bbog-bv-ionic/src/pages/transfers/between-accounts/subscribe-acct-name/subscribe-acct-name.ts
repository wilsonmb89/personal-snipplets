import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { App, IonicPage, LoadingController, Nav, NavController, NavParams, Tab, Tabs } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { AccountAny } from '../../../../app/models/enrolled-transfer/account-any';
import { AccountBalance } from '../../../../app/models/enrolled-transfer/account-balance';
import { TransferInfo } from '../../../../app/models/transfers/transfer-info';
import { BdbModalProvider } from '../../../../providers/bdb-modal/bdb-modal';
import { BdbPlatformsProvider } from '../../../../providers/bdb-platforms/bdb-platforms';
import { BdbToastProvider } from '../../../../providers/bdb-toast/bdb-toast';
import { EnrolledAccountOpsProvider } from '../../../../providers/enrolled-account-ops/enrolled-account-ops';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { TransfersDelegateService } from '@app/delegate/transfers-delegate/transfers-delegate.service';
import {SubscribeTransferAcctRq} from '../../../../new-app/core/services-apis/transfer/transfer-core/models/subscribe-transfer-acct.model';
import { BdbNormalizeDiacriticDirective } from '../../../../directives/bdb-normalize-diacritic/bdb-normalize-diacritic';

@PageTrack({ title: 'subscribe-acct-name' })
@IonicPage({
  name: 'subscribe%acct%name',
  segment: 'subscribe%acct%name'
})
@Component({
  selector: 'page-subscribe-acct-name',
  templateUrl: 'subscribe-acct-name.html',
})
export class SubscribeAcctNamePage {

  acctNickNameForm: FormGroup;
  title: string;
  subtitle: string;
  enrolledAccounts: Array<AccountBalance> = [];
  navTitle = 'Inscripción de cuentas';
  private _funnel = this.funnelKeys.getKeys().enrollAccounts;
  abandonText = BdbConstants.ABANDON_ENROLL;
  transferNow: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbModal: BdbModalProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private navigation: NavigationProvider,
    private enrAccountOps: EnrolledAccountOpsProvider,
    private bdbToast: BdbToastProvider,
    private loading: LoadingController,
    private bdbPlatforms: BdbPlatformsProvider,
    private appCtrl: App,
    private transfersDelegateService: TransfersDelegateService
  ) {
    this.title = 'Ingresa un nombre para esta cuenta';
    this.subtitle = 'Nombre de favorito';
    this.acctNickNameForm = this.formBuilder.group({
      nickName: ['', [Validators.required]]
    });
  }

  public onTextChange(event): void {
    event.target.value = BdbNormalizeDiacriticDirective.normalizeDiacriticText(event.target.value);
    this.acctNickNameForm.controls['nickName'].setValue(event.target.value);
  }

  validatelaunchNext(subscribeAcct: SubscribeTransferAcctRq) {
    this.enrolledAccounts = this.bdbInMemory.getItemByKey(InMemoryKeys.EnrolledAccountsList);
    const acct: AccountBalance = this.enrolledAccounts.find((e: AccountBalance) => {
      return e.productNumber.includes(subscribeAcct.targetAccountId, 0);
    });
    if (acct) {
      this.mapTransferInfo(acct, subscribeAcct);
      this.navCtrl.push('amount%input', {
        option: 'no-back-option'
      });
    } else {
      this.showErrorOnInquiryFail();
    }
  }

  getEnrolledAccounts(subscribeAcct: SubscribeTransferAcctRq) {
    const load = this.loading.create();
    load.present();
    this.transfersDelegateService.getAffiliatedAccounts().subscribe(
      res => {
        load.dismiss();
        if (this.transferNow) {
          this.validatelaunchNext(subscribeAcct);
        } else {
          this.navCtrl.setRoot('NewTransferMenuPage');
        }
      },
      err => {
        load.dismiss();
        if (this.transferNow) {
          this.bdbModal.launchErrModal(
            'Servicio no disponible',
            'No se pudieron validar tus cuentas inscritas en este momento.',
            'Aceptar', () => {
              this.onAbandonClicked();
            });
        } else {
          this.navCtrl.setRoot('NewTransferMenuPage');
        }
      }
    );
  }

  showErrorOnInquiryFail() {
    this.bdbModal.launchErrModal(
      'La información no es válida',
      'Tu cuenta no pudo ser verificada aún. Intenta de nuevo mas tarde.',
      'Continuar',
      () => {
        this.onAbandonClicked();

      });
  }

  mapTransferInfo(acct, subscribeAcct: SubscribeTransferAcctRq) {
    const transferInfo: TransferInfo = new TransferInfo();
    const accountAny: AccountAny = new AccountAny(false, null, acct);
    transferInfo.accountTo = accountAny;
    const regExp: RegExp = /(0001|0002|0023|0052)/;
    if (subscribeAcct.targetBankId.match(regExp)) {
      transferInfo.isAval = true;
      transferInfo.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
    } else {
      transferInfo.isAval = false;
      transferInfo.transactionCost = BdbConstants.TRANSACTION_COST.ACH_TRANSFER;
    }
    this.bdbInMemory.setItemByKey(InMemoryKeys.TransferInfo, transferInfo);
  }

  triggerAction(transferNow: boolean) {
    this.transferNow = transferNow;
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.alias);
    const subscribeAcct: SubscribeTransferAcctRq = this.bdbInMemory.getItemByKey(InMemoryKeys.ProductToEnroll);
    subscribeAcct.nickName = this.acctNickNameForm.controls.nickName.value;
    this.bdbInMemory.setItemByKey(InMemoryKeys.ProductToEnroll, subscribeAcct);
    this.enrollAccount(subscribeAcct);
  }

  enrollAccount(subscribeAcct: SubscribeTransferAcctRq) {
    const load = this.loading.create();
    load.present();
    this.enrAccountOps.enrollNewAccount(subscribeAcct).subscribe(
      (data) => {
        load.dismiss();
        this.bdbInMemory.clearItem(InMemoryKeys.EnrolledAccountsList);
        this.bdbToast.showToast('Cuenta inscrita correctamente!');
        this.getEnrolledAccounts(subscribeAcct);
      },
      (err) => {
        load.dismiss();
        const errMsg = err && err.error && err.error.message ? err.error.message :
          'Transacción rechazada. Producto destino no autorizada, comuníquese con la entidad';
        this.bdbModal.launchErrModal(
          'La información no es válida',
          errMsg,
          'Continuar');
      });
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }
}
