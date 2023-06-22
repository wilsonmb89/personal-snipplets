import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { BdbMap } from '../../../../app/models/bdb-generics/bdb-map';
import { RechargeInfo } from '../../../../app/models/recharges/recharge-info';
import { MobileSummaryProvider, SummaryHeader } from '../../../../components/mobile-summary';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { PhoneLengthValidator } from '../../../../validators/phoneLength';
import { Events } from 'ionic-angular';

@PageTrack({ title: 'recharge-phone-input' })
@IonicPage({
  name: 'recharge%phone%input',
  segment: 'recharge-phone-input'
})
@Component({
  selector: 'page-phone-input',
  templateUrl: 'phone-input.html',
})
export class PhoneInputPage {

  subtitle = 'Ingresa el número de celular:';
  abandonText = BdbConstants.ABANDON_PAY;
  private phoneForm: FormGroup;
  selectedCarrier: BdbMap;
  key: string;
  navTitle = 'Recargas';
  private _recharges = this.funnelKeys.getKeys().recharges;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private progressBar: ProgressBarProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private accessDetail: AccessDetailProvider,
    private mobileSummary: MobileSummaryProvider,
    private events: Events
  ) {
    this.phoneForm = this.formBuilder.group({
      phoneNumber: ['', [PhoneLengthValidator.isValid]]
    });
    this.events.publish('srink', true);
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }

  ionViewWillEnter() {
    const rechargeInfo: RechargeInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.RechargeInfo);
    this.selectedCarrier = rechargeInfo.carrier;
    this.progressBar.setLogo(this.selectedCarrier.src);
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [
      this.selectedCarrier.value
    ]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);

    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, null);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, false);

    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_3, null);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_3, false);

    if (this.accessDetail.isOriginSelected()) {
      this.accessDetail.updateProgressBarDoneRecharge(this.accessDetail.getOriginSelected());
    }

    this.setMobileHeader(rechargeInfo);
  }

  setMobileHeader(rechargeInfo: RechargeInfo) {
    const header = new SummaryHeader();
    header.hasContraction = false;
    header.logoPath = rechargeInfo.carrier.src;
    header.title = rechargeInfo.carrier.value;
    this.mobileSummary.setHeader(header);
  }

  triggerAmmtInput() {
    this.funnelEvents.callFunnel(this._recharges, this._recharges.steps.cellphone);
    /* read phone field in the form */
    const phone = this.phoneForm.value.phoneNumber;
    const rechargeInfo: RechargeInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.RechargeInfo);
    rechargeInfo.phoneNumber = phone;
    this.bdbInMemory.setItemByKey(InMemoryKeys.RechargeInfo, rechargeInfo);
    this.navCtrl.push('recharge%amount%input');
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }
}
