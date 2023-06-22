import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { animate, style, transition, trigger } from '@angular/animations';
import { PageTrack } from '../../../app/core/decorators/AnalyticTrack';
import { EsLang } from '../../../app/models/bdb-generics/es';
import { PinProvider } from '../../../providers/authenticator/pin';
import { LoadingController } from 'ionic-angular';
import { AuthenticatorProvider } from '../../../providers/authenticator/authenticator';
import { BdbModalProvider } from '../../../providers/bdb-modal/bdb-modal';
import { BdbConstants } from '../../../app/models/bdb-generics/bdb-constants';
import { Location } from '@angular/common';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { WebSocketSessionProvider } from '../../../providers/web-socket-session/web-socket-session';
import { ENV } from '@app/env';

@PageTrack({ title: 'recover-password' })
@IonicPage({
  segment: 'recover-password/:type'
})
@Component({
  selector: 'page-recover-password',
  templateUrl: 'recover-password.html',
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
    ]
    )
  ]

})
export class RecoverPasswordPage implements OnInit {

  userData: { documentType, documentNumber, pin };
  loading: any;
  stepForm: number;
  operation: string;
  copies: any;
  productValidate: string;
  phoneValidate: string;
  confProductField: any;

  param: string;

  constructor(private navCtrl: NavController,
    public navParams: NavParams,
    private pinProvider: PinProvider,
    public loadingCtrl: LoadingController,
    private auth: AuthenticatorProvider,
    private bdbModal: BdbModalProvider,
    private location: Location,
    private bdbInMemory: BdbInMemoryProvider,
    private wsSessionProvider: WebSocketSessionProvider
  ) {
    this.stepForm = 1;
    this.confProductField = BdbConstants.SET_PWD_CONF;
  }

  ngOnInit() {
    if (ENV.IS_REDIRECT_TEMP) {
      this.navCtrl.setRoot('LoginPage');
    }
    this.wsSessionProvider.wsSessionClosed();
  }

  ionViewCanEnter() {
    if (this.navParams.data.type) {
      this.setNavvars(this.navParams.data);
      return true;
    } else {
      return false;
    }
  }

  private setNavvars(params) {
    if (params.type) {
      this.operation = params.type;
      this.userData = {
        documentType: 'C',
        documentNumber: '',
        pin: ''
      };
      this.copies = EsLang.COPIES[this.operation];
    }
  }

  submitRegistry(e) {
    this.userData = e;
    this.getDataSecure();
  }

  submitProduct(e) {
    this.validateUser(e.pin);
  }

  submitPassword(e) {

    this.userData.pin = e.pin;
    if (this.operation === 'CREATE_PIN') {
      const loader = this.loadingCtrl.create();
      loader.present().then(() => {
        this.pinProvider.recover(this.userData.documentType, this.userData.documentNumber, e.pin, e.code).subscribe(data => {
          this.stepForm = 4;
          loader.dismiss();
        },
          (error) => {
            this.modalCodeError(loader);
          });
      });
    } else {
      this.saveModifyPin(e.code);
    }
  }


  cancelRegistry() {
    const isFromFrame = this.bdbInMemory.getItemByKey(InMemoryKeys.IsLoginFromFrame);
    if (isFromFrame !== null) {
      this.bdbInMemory.setItemByKey(InMemoryKeys.IsLoginFromFrame, null);
      this.location.back();
    } else {
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.popToRoot();
      } else {
        this.navCtrl.setRoot('LoginPage');
      }
    }
  }

  private getDataSecure() {
    const loader = this.loadingCtrl.create();
    loader.present().then(() => {
      this.pinProvider.getDataSecure(this.userData.documentType, this.userData.documentNumber)
        .subscribe(d => {
          this.processDataSecure(d);
          loader.dismiss();

        }, e => {
          this.bdbModal.launchErrModal(this.copies.DATA_USER.MODAL_ERROR_TITLE_3,
            this.copies.DATA_USER.MODAL_ERROR_SUB_3,
            EsLang.COPIES.GENERICS.OK,
            () => { });
          loader.dismiss();
        });
    });

  }

  private processDataSecure(d) {
    this.productValidate = d.productCode;
    this.phoneValidate = d.mobile;
    if (!this.productValidate) {
      this.bdbModal.launchErrModal(this.copies.DATA_USER.MODAL_ERROR_TITLE_2,
        this.copies.DATA_USER.MODAL_ERROR_SUB_2,
        EsLang.COPIES.GENERICS.OK,
        () => { });
    } else if (!this.phoneValidate || this.phoneValidate === '') {
      this.bdbModal.launchErrModal(this.copies.DATA_USER.MODAL_ERROR_TITLE_1,
        this.copies.DATA_USER.MODAL_ERROR_SUB_1,
        EsLang.COPIES.GENERICS.OK,
        () => {
          this.cancelRegistry();
        });
    } else if (d.hasSecurePin && this.operation === 'CREATE_PIN') {
      this.bdbModal.launchErrModal(this.copies.DATA_USER.MODAL_ERROR_TITLE_4,
        this.copies.DATA_USER.MODAL_ERROR_SUB_4,
        EsLang.COPIES.GENERICS.OK,
        () => {
          this.cancelRegistry();
        });
    } else if (!d.hasSecurePin && this.operation === 'RECOVER_PIN') {
      this.bdbModal.launchErrModal(this.copies.DATA_USER.MODAL_ERROR_TITLE_5,
        this.copies.DATA_USER.MODAL_ERROR_SUB_5,
        EsLang.COPIES.GENERICS.OK,
        () => {
          this.cancelRegistry();
        });
    } else {
      this.stepForm = 2;
    }

  }

  private validateUser(pin) {

    const loader = this.loadingCtrl.create();
    loader.present().then(() => {
      this.pinProvider.getValidateProduct(this.userData.documentType,
        this.userData.documentNumber,
        this.productValidate,
        pin
      )
        .subscribe(d => {
          if (d.result) {
            this.auth.sendOtp(this.userData.documentType, this.userData.documentNumber);
            this.stepForm = 3;
          } else {
            this.bdbModal.launchErrModal(this.copies.DATA_USER.MODAL_ERROR_TITLE_2,
              this.copies.DATA_USER.MODAL_ERROR_SUB_2,
              EsLang.COPIES.GENERICS.OK,
              () => { });
          }
          loader.dismiss();

        }, e => {
          this.bdbModal.launchErrModal(this.copies.DATA_USER.MODAL_ERROR_TITLE_2,
            this.copies.DATA_USER.MODAL_ERROR_SUB_2,
            EsLang.COPIES.GENERICS.OK,
            () => { });
          loader.dismiss();
        });
    });
  }

  private saveCreatePin(otp) {
    const loader = this.loadingCtrl.create();
    loader.present().then(() => {
      this.otpAddPin(loader, otp);
    });
  }

  private otpAddPin(loader, otp) {
    this.auth.validateOtp(this.userData.documentType, this.userData.documentNumber, otp).subscribe(v => {
      this.addPin(loader);
    }, e => {
      this.modalCodeError(loader);
    });
  }

  private addPin(loader) {

    this.pinProvider.add(this.userData.documentType, this.userData.documentNumber, this.userData.pin).subscribe(data => {
      this.stepForm = 4;
      loader.dismiss();
    },
      (error) => {
        this.modalCodeError(loader);
      });

  }



  private saveModifyPin(otp) {
    const loader = this.loadingCtrl.create();
    loader.present().then(() => {
      this.pinProvider.recover(this.userData.documentType, this.userData.documentNumber, this.userData.pin, otp).subscribe(data => {
        this.stepForm = 4;
        loader.dismiss();
      },
        (error) => {
          this.modalCodeError(loader);

        });
    });
  }


  private modalCodeError(loader) {
    this.bdbModal.launchErrModal(EsLang.COPIES.GENERICS.ERROR_CODE_TITLE,
      EsLang.COPIES.GENERICS.ERROR_CODE_DESC,
      EsLang.COPIES.GENERICS.OK,
      () => { });
    loader.dismiss();

  }

}
