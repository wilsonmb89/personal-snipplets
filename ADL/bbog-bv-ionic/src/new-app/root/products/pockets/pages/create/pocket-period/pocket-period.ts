import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavigationProvider } from '../../../../../../../providers/navigation/navigation';
import { BdbInMemoryProvider } from '../../../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../../../../providers/storage/in-memory.keys';
import { PocketDetailRq } from '../../../models/pocket';
import { MinAmmtValidator } from '../../../../../../../validators/minAmmt';

@IonicPage()
@Component({
  selector: 'page-pocket-period',
  templateUrl: 'pocket-period.html',
})
export class PocketPeriodPage {

  leftHdrOption = 'Atrás';
  hideLeftOption = false;
  navTitle = 'Alcancías';
  abandonText = 'Cancelar';
  form: FormGroup;
  periods = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private navigation: NavigationProvider,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider
  ) {
    this.periods = this.getPeriods();

    this.form = this.formBuilder.group({
      number: ['', [Validators.required, MinAmmtValidator.isValid, Validators.pattern('[0-9]*')]],
      periods: ['1', [Validators.required]]
    });
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.form.get('number').setValue(6);
    }, 200);
  }

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
    pocketDetail.term = this.getTerm(this.form.value.number, this.form.value.periods);
    this.bdbInMemory.setItemByKey(InMemoryKeys.PocketDetail, pocketDetail);
    this.navCtrl.push('PocketAccountPage');
  }

  getTerm(number, period) {
    if (+period === 2) {
      return +number * 12;
    }
    return +number;
  }

  getPeriods() {
    return [
      { id: '1', name: 'Meses' },
      { id: '2', name: 'Años' }
    ];
  }
}
