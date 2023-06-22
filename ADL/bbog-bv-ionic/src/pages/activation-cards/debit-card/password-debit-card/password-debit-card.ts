import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, Platform, Events } from 'ionic-angular';

import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { CustomerCard } from '../../../../app/models/activation-cards/customer-cards-list-rs';
import { BdbModalProvider } from '../../../../providers/bdb-modal/bdb-modal';
import { ModalSuccess } from '../../../../app/models/modal-success';
import { CardsInfoFacade } from '../../../../new-app/modules/settings/store/facades/cards-info.facade';
import { DebitCardActivationDelegateService } from '@app/delegate/customer-security-delegate/debit-card-activation-delegate.service';
import {
  ServiceApiErrorModalService
} from '@app/shared/components/modals/service-api-error-modal/provider/service-api-error-modal.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';

@IonicPage({
  name: 'password-debit-card',
  segment: 'password-debit-card'
})
@Component({
  selector: 'page-password-debit-card',
  templateUrl: 'password-debit-card.html',
})
export class PasswordDebitCardPage {

  title: string;
  subtitle: string;
  titleSecond: string;
  subtitleSecond: string;
  abandonText: string;
  formSecure: FormGroup;
  error = false;
  activationCardSelected: CustomerCard;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private navigation: NavigationProvider,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbModal: BdbModalProvider,
    private platforms: Platform,
    private events: Events,
    private cardsInfoFacade: CardsInfoFacade,
    private debitCardActivationService: DebitCardActivationDelegateService,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private serviceApiErrorModalService: ServiceApiErrorModalService,
  ) {

    this.activationCardSelected = bdbInMemory.getItemByKey(InMemoryKeys.ActivationCard);

    this.titleSecond = 'Asigna tu clave de tu Tarjeta Débito';
    this.subtitleSecond = 'La clave debe tener 4 dígitos numéricos';
    this.abandonText = 'Cancelar';

    this.buildformSecure();
  }

  buildformSecure() {
    this.formSecure = this.formBuilder.group(
      {
        pin: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])],
        confirmPin: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])]
      }, { validator: this.matchingPasswords('pin', 'confirmPin') });
  }

  ionViewDidLoad() {
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        this.error = true;
        return {
          mismatchedPasswords: true
        };
      } else {
        this.error = false;
      }
    };
  }

  submit() {
    const loading = this.loadingCtrl.create();
    loading.present().then(() => {
      const acctId = this.activationCardSelected.cardNumber;
      const secretId = this.formSecure.value.pin;
      this.debitCardActivationService.debitCardActivation(acctId, secretId).subscribe(
        debitCardRes => {
          this.cardsInfoFacade.refreshCardsInfo();
          loading.dismiss();
          const dataModal: ModalSuccess = {
            title: 'Tarjeta Débito activada',
            content: 'Desde este momento puedes disfrutar de todos sus beneficios.',
            button: 'Finalizar'
          };
          this.bdbModal.launchSuccessModal(dataModal, (res: any, role: any) => {
            if (!this.platforms.is('browser')) {
              this.events.publish('modal:close');
            }
            this.navCtrl.setRoot('DashboardPage');
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
  }

}
