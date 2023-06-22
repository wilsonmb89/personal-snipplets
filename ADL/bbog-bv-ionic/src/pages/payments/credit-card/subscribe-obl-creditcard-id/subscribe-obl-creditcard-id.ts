import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, TextInput } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { BanksList } from '../../../../app/models/banks-rs';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { EnrollProduct } from '../../../../app/models/transfers/subscribe-acct';
import { BankInfo } from '../../../../app/models/bank-info';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { Events } from 'ionic-angular';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import {ManageOblRq} from '@app/apis/transfer/transfer-core/models/manage-obl.model';
import {UserFacade} from '@app/shared/store/user/facades/user.facade';

@PageTrack({title: 'subscribe-obl-creditcard'})
@IonicPage({
  name: 'subscribe%obl%creditcard',
  segment: 'subscribe%obl%creditcard'
})
@Component({
  selector: 'page-subscribe-obl-creditcard-id',
  templateUrl: 'subscribe-obl-creditcard-id.html',
})
export class SubscribeOblCreditcardIdPage {

  @ViewChild('banknameinput') bankName: TextInput;
  @ViewChild('crediccardnumber') creditcardNumber: TextInput;

  title: string;
  detailForm: FormGroup;
  itemsBare: any[];
  disabled: boolean;
  creditCard: EnrollProduct;
  subscribeOblRq: ManageOblRq;
  abandonText = BdbConstants.ABANDON_ENROLL;
  navTitle = 'Inscripción de tarjetas';
  private _funnel = this.funnelKeys.getKeys().enrollCreditCards;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private navigation: NavigationProvider,
    private events: Events,
    private bdbUtilsProvider: BdbUtilsProvider,
    private userFacade: UserFacade
  ) {
    this.title = 'Datos de la tarjeta';
    this.detailForm = this.formBuilder.group({
      bankName: ['', [Validators.required]],
      ccNumber: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{16}')])],
    });
    this.disabled = true;
    this.events.publish('srink', true);
  }

  initializeItems() {
    this.userFacade.bankListForCreditCard$()
    .subscribe( bankList => this.itemsBare = bankList.filter(bank => (!/507|303|558|291|070|684/.test(bank.id))) );
  }

  getItems() {
    this.disabled = true;
    // set val to the value of the form
    const val = this.detailForm.get('bankName').value.toString();
    // Reset items back to all of the items
    this.initializeItems();
    if (val && val.trim() !== ''  && val.length > 2) {
      this.itemsBare = this.itemsBare.filter((item) => {
       const name = this.bdbUtilsProvider.replaceAccents(item.name);
        return (name.toLowerCase().indexOf(this.bdbUtilsProvider.replaceAccents(val).toLowerCase()) > -1);
      });
    } else {
      this.itemsBare = [];
    }
  }

  onItemClick(item: BanksList) {
    this.detailForm.controls['bankName'].setValue(item.name);
    this.itemsBare = [];
    this.disabled = false;
    const bankInfo = new BankInfo(item.id, BdbConstants.BRANCH_ID);
    this.subscribeOblRq = new ManageOblRq();
    this.subscribeOblRq.targetAccountBankId = bankInfo.bankId;
    this.bankName.setFocus();
  }

  triggerHolderInfo() {
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.bankHolder);
    this.subscribeOblRq.targetAccountId = this.detailForm.get('ccNumber').value.toString();
    this.subscribeOblRq.targetAccountType = BdbConstants.CREDIT_CARD;
    this.bdbInMemory.setItemByKey(InMemoryKeys.ProductToEnroll, this.subscribeOblRq);
    this.navCtrl.push('subscribe%cc%person');
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }
}
