import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NavigationProvider } from '../../../../../../../providers/navigation/navigation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BdbInMemoryProvider } from '../../../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../../../../providers/storage/in-memory.keys';
import { PocketDetailRq } from '../../../models/pocket';
import { BdbNormalizeDiacriticDirective } from '../../../../../../../directives/bdb-normalize-diacritic/bdb-normalize-diacritic';

@IonicPage()
@Component({
  selector: 'page-pocket-name',
  templateUrl: 'pocket-name.html',
})
export class PocketNamePage {

  leftHdrOption = 'Atrás';
  hideLeftOption = false;
  navTitle = 'Alcancías';
  abandonText = 'Cancelar';
  form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private navigation: NavigationProvider,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]]
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
    pocketDetail.pocketName = this.form.value.name;
    this.bdbInMemory.setItemByKey(InMemoryKeys.PocketDetail, pocketDetail);
    this.navCtrl.push('PocketAmountPage');
  }


  public onTextChange(event): void {
    event.target.value = BdbNormalizeDiacriticDirective.normalizeDiacriticText(event.target.value);
    this.form.controls['name'].setValue(event.target.value);
  }
}
