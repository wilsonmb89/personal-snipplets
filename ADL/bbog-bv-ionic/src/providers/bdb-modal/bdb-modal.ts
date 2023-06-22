import { Injectable } from '@angular/core';
import { ModalController, ModalOptions, Modal } from 'ionic-angular';
import { ModalSuccess } from '../../app/models/modal-success';
import { BdbCookies } from '../../providers/bdb-cookie/bdb-cookie';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';

export class ModalGenericInfo {
  img: string;
  title: string;
  description: string;
  buttons: string;
}

@Injectable()
export class BdbModalProvider {
  private modal: Modal;
  constructor(
    private modalCtrl: ModalController,
    public bdbCookie: BdbCookies
  ) { }

  launchErrModal(title: string, message: string, msgButton: string,
    dismissed?: (string) => void, auxButton?: string, positionText?: string) {
    const modalOptions: ModalOptions = {
      enableBackdropDismiss: false,
      cssClass: 'err-modal'
    };
    this.modal = this.modalCtrl.create('ModalErrorPage', { title, message, msgButton, auxButton, positionText }, modalOptions);
    this.modal.present();
    this.modal.onDidDismiss((option) => {
      if (option) {
        if (dismissed) {
          dismissed(option);
        }
      }
    });
  }

  launchInfoModal(title: string, message: string, msgButton: string, dismissed: (string) => void) {
    const modalOptions: ModalOptions = {
      enableBackdropDismiss: false,
      cssClass: 'info-modal'
    };
    this.modal = this.modalCtrl.create('ModalInfoPage', { title, message, msgButton }, modalOptions);
    this.modal.present();
    this.modal.onDidDismiss((option) => {
      if (option) {
        dismissed(option);
      }
    });
  }

  launchSuccessModal(dataModal: ModalSuccess, callback: (data: any, role: string) => void) {

    const modalOptions: ModalOptions = {
      enableBackdropDismiss: false,
      cssClass: 'success-modal'
    };

    const modal: Modal = this.modalCtrl.create('modal%success', { dataModal }, modalOptions);

    modal.onDidDismiss(callback);
    modal.present();
  }

  launchTerminosModal(title: string, message: string, dismissed?: (string) => void) {
    const modalOptions: ModalOptions = {
      enableBackdropDismiss: true,
      cssClass: 'terminos-modal'
    };
    this.modal = this.modalCtrl.create('ModalTerminosPage', { title, message }, modalOptions);
    this.modal.present();
    this.modal.onDidDismiss((option) => {
      dismissed(option);
    });
  }

  launchPinModal(modalData: { iconPath, title, text }, dismissed?: (string) => void) {
    const modalOptions: ModalOptions = {
      enableBackdropDismiss: false,
      cssClass: 'token-modal'
    };
    const modal: Modal = this.modalCtrl.create('ModalCashAdvancePage',
      modalData,
      modalOptions);
    modal.onDidDismiss((data) => {
      if (data) {
        dismissed(data);
      }
    });
    modal.present();
  }

  launchInfoBlackModal(page: string, callback: (data: any, role: string) => void) {

    const modalOptions: ModalOptions = {
      enableBackdropDismiss: false,
      cssClass: 'info-black-modal'
    };

    const modal: Modal = this.modalCtrl.create(page, {}, modalOptions);

    modal.onDidDismiss(callback);
    modal.present();
  }

  closeModal() {
    if (this.modal) {
      this.modal.dismiss();
    }
  }

  launchModalFlowConfirmation(data) {

    const modalOptions: ModalOptions = {
      cssClass: 'modal-flow-confirmation'
    };

    const modal = this.modalCtrl.create('ModalFlowConfirmationPage', { data }, modalOptions);
    modal.present();
  }

  launchModal(pageName, className) {
    const modalOptions: ModalOptions = {
      cssClass: className
    };

    const modal = this.modalCtrl.create(pageName, {}, modalOptions);
    modal.present();
  }

  launchModalGenericInfo(data: ModalGenericInfo) {

    const modalOptions: ModalOptions = {
      cssClass: 'modal-generic-info'
    };

    const modal = this.modalCtrl.create('ModalGenericInfoPage', { data }, modalOptions);
    modal.present();
  }

  launchModalContingencyFIC() {
    const data: ModalGenericInfo = new ModalGenericInfo();
    data.img = 'assets/imgs/warning-clock.svg';
    data.title = `Información <b>importante</b>`;
    data.description = `Te invitamos a realizar tus transacciones de <b>lunes a domingo</b> en el horario <b>de 6:00 a.m. a 10:00 p.m.</b>`;

    this.launchModalGenericInfo(data);
  }

  launchModalCovid19Info(dismissed: () => void) {
    const modalOptions: ModalOptions = { enableBackdropDismiss: true, cssClass: 'covid-19-info-modal' };
    const modal: Modal = this.modalCtrl.create('ModalCovid19InfoPage', {}, modalOptions);
    modal.onDidDismiss(dismissed);
    modal.present();
  }

  validateCookieCovidModal() {
    const cookieCount = +this.bdbCookie.getCookie(InMemoryKeys.CovidModalCounter);
    if (cookieCount < 5) {
      this.bdbCookie.setCookie(InMemoryKeys.CovidModalCounter, (cookieCount + 1), 360);
      return true;
    }
    return false;
  }
}
