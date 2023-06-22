import { Component } from '@angular/core';
import { Events, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { MobileSummaryProvider } from '../../../../components/mobile-summary';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { ProviderPila } from '../../../../app/models/pay/pila';
import { TransactionsProvider } from '../../../../providers/transactions/transactions';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { GetBillService } from '@app/modules/payments/services/get-bill.service';
import { GetBillRs } from '@app/apis/payment-billers/models/payment-billers-api.model';
import { ListPaymentAgreementDelegate } from '../../../../new-app/core/services-delegate/list-parameters/list-payment-agreement-delegate.service';

@IonicPage({
  name: 'page%pila%select',
  segment: 'page-pila-select'
})
@Component({
  selector: 'page-pila-select',
  templateUrl: 'pila-select.html',
})
export class PilaSelectPage {

  formPila: FormGroup;
  listProviders: ProviderPila;
  private _funnel;
  navTitle = 'Pago planilla asistida';
  abandonText = BdbConstants.ABANDON_PAY;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private navigation: NavigationProvider,
              private mobileSummary: MobileSummaryProvider,
              private bdbInMemory: BdbInMemoryProvider,
              private funnelKeysProvider: FunnelKeysProvider,
              private funnelEventsProvider: FunnelEventsProvider,
              private progressBar: ProgressBarProvider,
              private transaction: TransactionsProvider,
              private loading: LoadingController,
              private accessDetail: AccessDetailProvider,
              private events: Events,
              private getBillService: GetBillService,
              private listPaymentAgreementDelegate: ListPaymentAgreementDelegate
  ) {
    this._funnel = this.funnelKeysProvider.getKeys().pila;
    this.buildFormPila();
    this.events.publish('srink', true);
  }

  ionViewWillEnter() {
    this.mobileSummary.reset();
    this.progressBar.resetObject();
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Planilla asistida (PILA)');
    if (this.accessDetail.isOriginSelected()) {
      this.accessDetail.updateProgressBarDone(this.accessDetail.getOriginSelected());
    }
  }

  ionViewDidLoad() {
    this.buildProviders();
  }

  private buildFormPila() {
    this.formPila = this.formBuilder.group(
      {
        type: ['d', Validators.compose([Validators.required])],
        ref: ['', Validators.compose([Validators.required, Validators.minLength(2)])]
      }
    );
  }

  public submit() {
    this.getBillData(this.formPila.value);
  }


  private buildProviders() {
    const loader = this.loading.create();
    loader.present().then(() => {
      this.listPaymentAgreementDelegate.getPilaAgreements().subscribe(d => {
        this.listProviders = d;
        loader.dismiss();
      }, err => {
        this.transaction.onError(loader, err);
      });
    });
  }

  private getBillData(data) {
    const billInfoRq = this.getBillService.mapBillerMngrRq(data);
    this.bdbInMemory.setItemByKey(InMemoryKeys.orgId, billInfoRq.orgId);
    const loader = this.loading.create();
    loader.present().then(() => {
      this.getBillService.getBiller(billInfoRq).subscribe(d => {
        this.gotoSelectAcct(d);
        loader.dismiss();
      }, err => {
        this.transaction.onError(loader, err);
      });
    });
  }

  gotoSelectAcct(data: GetBillRs) {
    this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.option);
    const pilaInfo = {
      dataForm: this.formPila.value,
      billInfo: data,
      charge: BdbConstants.TRANSACTION_COST.NO_COST
    };

    this.bdbInMemory.setItemByKey(InMemoryKeys.PilaInfo, pilaInfo);
    this.navCtrl.push('page%pila%from%account', {}, {
      animate: true,
      direction: 'forward'
    });
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

}
