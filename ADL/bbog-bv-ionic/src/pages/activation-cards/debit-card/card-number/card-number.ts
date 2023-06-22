import { Component, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { TokenOtpProvider } from '../../../../providers/token-otp/token-otp/token-otp';

@IonicPage({
  name: 'debit-card-number',
  segment: 'debit-card-number'
})
@Component({
  selector: 'page-card-number',
  templateUrl: 'card-number.html',
})
export class CardNumberPage {

  title: string;
  subtitle: string;
  abandonText: string;
  numberCardForm: FormGroup;
  validateNumberCard: string;
  error = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private navigation: NavigationProvider,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private tokenOtp: TokenOtpProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
  ) {

    this.validateNumberCard = bdbInMemory.getItemByKey(InMemoryKeys.ValidateNumberCard);

    this.title = 'Activación de Tarjetas';
    this.subtitle = 'Ingresa los <strong>últimos 8 dígitos de tu Tarjeta Débito.</strong>';
    this.abandonText = 'Cancelar';

    this.numberCardForm = this.formBuilder.group({
      numberCard: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
    });
  }

  ionViewDidLoad() {
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  submit() {
    const numberCard: number = this.numberCardForm.controls.numberCard.value;
    if (numberCard.toString() === this.validateNumberCard) {
      this.error = false;
      this.tokenOtp.requestToken(
        this.viewRef,
        this.resolver,
        () => {
          this.numberCardForm.patchValue({ numberCard: '' });
          this.navCtrl.push('password-debit-card');
        },
        'debitCardActivation'
      );
    } else {
      this.error = true;
    }
  }

}
