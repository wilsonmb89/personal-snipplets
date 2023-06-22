import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {NavigationProvider} from '../../../../../../../providers/navigation/navigation';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InMemoryKeys} from '../../../../../../../providers/storage/in-memory.keys';
import {BdbInMemoryProvider} from '../../../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import {PocketDetailRq, Pocket} from '../../../models/pocket';
import * as pocketTypes from '../../../services/pocket-types.json';
import * as pocketList from '../../../services/pocket-get.json';
import {SelectAccountHandlerProvider} from '../../../../../../../providers/select-account-handler/select-account-handler';
import {BdbModalProvider} from '../../../../../../../providers/bdb-modal/bdb-modal';
import {BdbConstants} from '../../../../../../../app/models/bdb-generics/bdb-constants';
import {ProductDetail} from '../../../../../../../app/models/products/product-model';

@IonicPage()
@Component({
  selector: 'page-pocket-goal',
  templateUrl: 'pocket-goal.html',
})
export class PocketGoalPage {

  leftHdrOption = 'Atrás';
  hideLeftOption = false;
  navTitle = 'Alcancías';
  abandonText = 'Cancelar';
  form: FormGroup;
  goals = [];
  data = [];
  public tempPocketList: { [key: string]: Pocket[] };
  public savingAccounts: ProductDetail[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private navigation: NavigationProvider,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private selectAccountHandler: SelectAccountHandlerProvider
  ) {
    this.form = this.formBuilder.group({
      goals: ['', [Validators.required]]
    });

      this.fillPocketTypes();
  }

  ionViewDidLoad() {
    this.events.publish('srink', true);
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const pocketDetail: PocketDetailRq = new PocketDetailRq();
    pocketDetail.pocketName = '';
    pocketDetail.savingGoal = 0;
    pocketDetail.monthlyAmt = 0;
    pocketDetail.openningAmt = 0;
    pocketDetail.pocketType = this.form.value.goals;
    this.bdbInMemory.setItemByKey(InMemoryKeys.PocketDetail, pocketDetail);
    this.navCtrl.push('PocketNamePage');
  }

  private fillPocketTypes() {
    this.goals = pocketTypes as any;
    this.tempPocketList = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerPocketList);
    this.savingAccounts = this.selectAccountHandler.getAccountsByType(false, [BdbConstants.ATH_SAVINGS_ACCOUNT]);
    if (this.tempPocketList && this.savingAccounts) {
    if (this.savingAccounts.length === 1) {
      const pocketsByAccount: Pocket[] = this.tempPocketList[`${this.savingAccounts[0].productNumberApi}`];
      this.goals = (pocketTypes as any).filter(category => {
        if (pocketsByAccount.filter(pocket => pocket.pocketType !== '999' && pocket.pocketType === category.id).length > 0) {
          return false;
        } else {
          return true;
        }
      });
    }
    }
    return true;
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.push('DashboardPage');
  }

}
