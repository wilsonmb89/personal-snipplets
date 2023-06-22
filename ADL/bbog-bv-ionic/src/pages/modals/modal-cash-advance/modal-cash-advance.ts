import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-modal-cash-advance',
  templateUrl: 'modal-cash-advance.html',
})
export class ModalCashAdvancePage {

  pinForm: FormGroup;

  iconPath: string;
  title: string;
  text: string;
  lengthIsValid: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private viewCtrl: ViewController
  ) {
    this.pinForm = this.formBuilder.group({
      pin: ['', [Validators.minLength(4), Validators.required]]
    });
  }

  ionViewWillEnter() {
    this.iconPath = this.navParams.get('iconPath');
    this.title = this.navParams.get('title');
    this.text = this.navParams.get('text');
  }

  validate() {
    const pin: string = this.getPin();
    if (pin !== null && pin !== undefined) {
      this.viewCtrl.dismiss(pin);
    }
  }

  validateLength() {
    const pin: string = this.getPin();
    if (pin.length === 4) {
      this.lengthIsValid = true;
    } else {
      this.lengthIsValid = false;
    }
  }

  private getPin() {
    return this.pinForm.get('pin').value;
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
