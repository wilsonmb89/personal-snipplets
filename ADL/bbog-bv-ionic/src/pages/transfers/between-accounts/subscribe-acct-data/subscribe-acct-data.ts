import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Events, IonicPage, NavController, NavParams, TextInput } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BankInfo } from '../../../../app/models/bank-info';
import { BanksList } from '../../../../app/models/banks-rs';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { IdLengthValidator } from '../../../../validators/idLenght';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import {SubscribeTransferAcctRq} from '../../../../new-app/core/services-apis/transfer/transfer-core/models/subscribe-transfer-acct.model';
import {BdbUtilsProvider} from '../../../../providers/bdb-utils/bdb-utils';
import {Observable} from 'rxjs/Observable';
import {Catalogue} from '@app/apis/user-features/models/catalogue.model';
import {UserFacade} from '@app/shared/store/user/facades/user.facade';

@PageTrack({ title: 'subscribe-acct-data' })
@IonicPage({
  name: 'subscribe%acct%data',
  segment: 'subscribe%acct%data'
})
@Component({
  selector: 'page-subscribe-acct-data',
  templateUrl: 'subscribe-acct-data.html',
})
export class SubscribeAcctDataPage {

  @ViewChild('bankInput') bankInput: TextInput;
  @ViewChild('acctNumberInput') acctNumberInput: TextInput;

  title: string;
  subtitleBank: string;
  subtitleNumber: string;
  acctDataForm: FormGroup;
  subscribeAcct = new SubscribeTransferAcctRq();
  navTitle = 'Inscripción de cuentas';
  itemsBare: any[];
  disabled = true;
  acctTypeSelected = true;
  abandonText = BdbConstants.ABANDON_ENROLL;
  isElectronicDeposit = false;

  private _funnel = this.funnelKeys.getKeys().enrollAccounts;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private navigation: NavigationProvider,
    private events: Events,
    private progressBar: ProgressBarProvider,
    private bdbUtilsProvider: BdbUtilsProvider,
    private userFacade: UserFacade
  ) {
    this.title = 'Datos de la cuenta';
    this.subtitleBank = 'Entidad Bancaria';
    this.subtitleNumber = 'Número de la cuenta';

    this.acctDataForm = this.formBuilder.group({
      bankInfo: ['', [Validators.required]],
      acctNumber: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*'), IdLengthValidator.isValid])],
    });
    events.publish('header:title', 'Transferencias Entre Cuentas');

  }

  initializeItems() {
    this.userFacade.bankListForTransfers$().subscribe( bankList => this.itemsBare = bankList );
  }

  ionViewWillEnter() {
    this.progressBar.resetObject();
    this.events.publish('srink', true);
  }

  getItems() {
    this.disabled = true;
    // set val to the value of the form
    const val = this.acctDataForm.get('bankInfo').value.toString();
    // Reset items back to all of the items
    this.initializeItems();
    if (val && val.trim() !== '' && val.length > 2) {
      this.itemsBare = this.itemsBare.filter((item) => {

        const name = this.bdbUtilsProvider.replaceAccents(item.name);
        return (name.toLowerCase().indexOf(this.bdbUtilsProvider.replaceAccents(val).toLowerCase()) > -1);
      });
    } else {
      this.itemsBare = [];
      this.isElectronicDeposit = false;
    }
  }

  onItemClick(item: BanksList) {
    this.acctDataForm.controls['bankInfo'].setValue(item.name);
    this.itemsBare = [];
    this.disabled = false;
    const bankInfo = new BankInfo(item.id, BdbConstants.BRANCH_ID);
    this.subscribeAcct.targetBankId = '0' + bankInfo.bankId;
    this.bankInput.setFocus();
    item.customFields.type === 'electronicDeposit' ? this.isElectronicDeposit = true : this.isElectronicDeposit = false;
  }

  triggerAcct(isElectronicDeposit: boolean): void {
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.bankHolder);
    const acctNumber = this.acctDataForm.controls.acctNumber.value;
    this.subscribeAcct.targetAccountId = acctNumber;
    if (!isElectronicDeposit) {
      this.subscribeAcct.targetAccountType = this.acctTypeSelected ? BdbConstants.SAVINGS_ACCOUNT : BdbConstants.CHECK_ACCOUNT;
    } else {
      this.subscribeAcct.targetAccountType = BdbConstants.ELECTRONIC_DEPOSIT_ACCOUNT;
    }
    this.bdbInMemory.setItemByKey(InMemoryKeys.ProductToEnroll, this.subscribeAcct);
    this.navCtrl.push('subscribe%acct%person');
  }

  toggleExtraBtn(btn: string) {
    if (btn === 'left') {
      this.acctTypeSelected = true;
    } else {
      this.acctTypeSelected = false;
    }
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }
}
