import {Component, Inject, Renderer2, ElementRef, OnInit} from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IdLengthValidator } from '../../../validators/idLenght';
import { DOCUMENT } from '@angular/common';
import { ENV } from '@app/env';
import { NavigationProvider } from '../../../providers/navigation/navigation';
import { FingerPrintDevice } from '../../../app/models/finger-print-device';
import { BdbFingerPrintProvider } from '../../../providers/bdb-finger-print/bdb-finger-print';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';
import { BdbSecuritySetupProvider } from '../../../providers/bdb-security/bdb-security-setup';
import { PulseModalControllerProvider } from '../../../providers/pulse-modal-controller/pulse-modal-controller';
import { Observable } from 'rxjs/Observable';
import { TooltipInfoOpsProvider } from '../../../new-app/shared/utils/bdb-pulse-ops-services/tooltip-info-ops';
import { TooltipInfoOptions, PulseTooltipInfoData } from '../../../new-app/shared/utils/bdb-pulse-ops-services/models/tooltip-info-options.model';

@IonicPage({
  segment: 'temp-login'
})
@Component({
  selector: 'page-temp-login',
  templateUrl: 'temp-login.html',
})
export class TempLoginPage implements OnInit {

  emails: any[] = [];
  limitChips: number;
  wasSent: boolean;
  placeholder: string;
  isDisabledEmails: boolean;
  starStatus: boolean;
  actionButtonTest: boolean;

  errorMsg: string;
  text: string;
  private login: FormGroup;
  private identificationNumber = '';
  private identificationType = 'C';
  imgPath: string;
  document = 'CC ' + '1031148759'.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  constructor(
    private navCtrl: NavController,
    private bdbInMemory: BdbInMemoryProvider,
    private formBuilder: FormBuilder,
    private navigation: NavigationProvider,
    @Inject(DOCUMENT) private _document,
    private _renderer2: Renderer2,
    private modalCtrl: ModalController,
    private bdbFingerPrint: BdbFingerPrintProvider,
    private el: ElementRef,
    private bdbPlatform: BdbPlatformsProvider,
    private bdbSecuritySetup: BdbSecuritySetupProvider,
    private pulseModalCtrl: PulseModalControllerProvider,
    private tooltipInfoOpsProvider: TooltipInfoOpsProvider
  ) {

    this.starStatus = true;
    this.imgPath = 'assets/imgs/logo_av_villas.png';
    this.text = 'Ingresa tu número de cédula para consultar tus productos';
    this.login = this.formBuilder.group({
      identificationNumber: ['', Validators.compose([Validators.required, Validators.maxLength(10),
      Validators.pattern('[0-9]*'), IdLengthValidator.isValid])],
    });
    this.limitChips = 5;
    this.wasSent = false;
    this.placeholder = '+ Añadir correos (máximo 5)';
    this.isDisabledEmails = false;
  }

  ngOnInit() {

    if (this.bdbPlatform.isCallBlockPlatform()) {
      this.navCtrl.setRoot('BlockPlatformPage');
    }

    if (ENV.STAGE_NAME !== 'dev') {
      this.navCtrl.setRoot('LoginPage');
    }

  }

  public submit() {

    this.bdbInMemory.setItemByKey(InMemoryKeys.HasToken, true);
    this.bdbInMemory.setItemByKey(InMemoryKeys.AccessToken, 'eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..FdMeJxkNNI2-SeO4U5Qf2g.espOK4vLefoopVtIt4XtK5RIRT6bpNlEjO94SBnjqv-3sC-3F3orxRLWcSiKC0Fzu853NT85PpbLUsbjJyK5WQ.npQeRzum4lpWLqvkhk38Mw');
    this.bdbInMemory.setItemByKey(InMemoryKeys.IdentificationNumber, '19902734');
    this.bdbInMemory.setItemByKey(InMemoryKeys.IdentificationType, 'C');
    const deviceId = this.bdbInMemory.getItemByKey(InMemoryKeys.DeviceId);
    const hasDeviceId = this.bdbInMemory.getItemByKey(InMemoryKeys.HasDeviceId);
    this.bdbFingerPrint.validateDeviceId(deviceId).subscribe(
      (fpValidateRs: FingerPrintDevice) => {
        if (fpValidateRs.enabled === 0 && !fpValidateRs.configured && hasDeviceId) {

          const modal = this.modalCtrl.create('FingerPrintAlertPage', {
            navCtrl: this.navCtrl
          });
          modal.present();
        } else {
          this.navCtrl.setRoot('MasterPage');
        }
      },
      (exc) => {
        this.navCtrl.setRoot('MasterPage');
      }
    );

    this.bdbInMemory.setItemByKey(InMemoryKeys.LAST_CONNECT, {
      ip: '127.0.0.1',
      lastConnectDate: + new Date(),
      actualDate: + new Date()
    });
    this.bdbSecuritySetup.getPublicBackKey();
  }

  fingerPrint() {
    this.bdbInMemory.setItemByKey(InMemoryKeys.IdentificationType, this.identificationType);
    this.bdbInMemory.setItemByKey(InMemoryKeys.IdentificationNumber, this.identificationNumber);

    this.navCtrl.setRoot('FingerPrintPage');

    this.bdbInMemory.setItemByKey(InMemoryKeys.LAST_CONNECT, {
      ip: '127.0.0.1',
      lastConnectDate: + new Date(),
      actualDate: + new Date()
    });
  }

  testLoading() {
    this.actionButtonTest = true;
    Observable.interval(10000).subscribe(x => {
      this.actionButtonTest = false;
    });
  }

  launchTooltip(elementHtml) {
    const tooltipInfo = new Array<PulseTooltipInfoData>();
    tooltipInfo.push({title: 'Title 1', description: 'Description 1'});
    tooltipInfo.push({title: 'Title 2', description: 'Description 2'});
    const tooltipOptions: TooltipInfoOptions = {
      content: tooltipInfo,
      htmlelementref: elementHtml,
      id: 'tooltip_1',
      orientation: 'right-start',
      size: 'xs'
    };
    this.tooltipInfoOpsProvider.presentToolTip(tooltipOptions).subscribe();
  }

  removeTooltips() {
    this.tooltipInfoOpsProvider.removeAllTooltip();
  }

  private async copyAccountInfo(): Promise<void> {
    try {
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      const info = document.getElementById('accountInfo').textContent.replace(/\./g, '').replace(/  /g, '');
      textarea.value = info;
      textarea.select();
      document.execCommand('copy');
      if (textarea && textarea.parentNode) {
      textarea.parentNode.removeChild(textarea);
    }
    } catch (err) {
      console.log('err', err);
    }
  }
}
