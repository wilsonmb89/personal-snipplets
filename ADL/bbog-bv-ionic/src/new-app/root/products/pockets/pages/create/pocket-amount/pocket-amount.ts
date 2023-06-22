import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavigationProvider } from '../../../../../../../providers/navigation/navigation';
import { MinAmmtValidator } from '../../../../../../../validators/minAmmt';
import { InMemoryKeys } from '../../../../../../../providers/storage/in-memory.keys';
import { BdbInMemoryProvider } from '../../../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { PocketDetailRq } from '../../../models/pocket';

@IonicPage()
@Component({
  selector: 'page-pocket-amount',
  templateUrl: 'pocket-amount.html',
})
export class PocketAmountPage {

  leftHdrOption = 'Atrás';
  hideLeftOption = false;
  navTitle = 'Alcancías';
  abandonText = 'Cancelar';
  form: FormGroup;
  withDecimal = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private navigation: NavigationProvider,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider
  ) {
    this.form = this.formBuilder.group({
      amount: ['', [Validators.required, MinAmmtValidator.isValid]]
    });
  }

  ionViewDidLoad() { }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const pocketDetail: PocketDetailRq = this.bdbInMemory.getItemByKey(InMemoryKeys.PocketDetail);
    pocketDetail.savingGoal = this.form.value.amount;
    this.bdbInMemory.setItemByKey(InMemoryKeys.PocketDetail, pocketDetail);
    this.navCtrl.push('PocketPeriodPage');
  }

}
