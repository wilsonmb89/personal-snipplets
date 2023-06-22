import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, TextInput } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { BillCovenant } from '../../../../app/models/bills/bill-covenant';
import { BdbPlatformsProvider } from '../../../../providers/bdb-platforms/bdb-platforms';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { Events } from 'ionic-angular';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { ListPaymentAgreementDelegate } from '@app/delegate/list-parameters/list-payment-agreement-delegate.service';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { InquiriesAgreementDto } from '@app/apis/payment-core/models/payment-agreement.model';

@PageTrack({ title: 'subscribe-bill-name' })
@IonicPage({
  name: 'suscribe%bill%name',
  segment: 'suscribe%bill%name'
})
@Component({
  selector: 'page-subscribe-bill-name',
  templateUrl: 'subscribe-bill-name.html',
})
export class SubscribeBillNamePage implements OnInit {

  @ViewChild('autoPaymentAgreement') billNameInput: TextInput;

  @Input() parentForm: FormGroup;
  @Input() controlName = 'autoPaymentAgreement';

  title: string;
  subtitle: string;
  billNameForm: FormGroup;
  itemsBare: Array<InquiriesAgreementDto>;
  abandonText = BdbConstants.ABANDON_PAY;
  agreements$: Observable<any[]>;
  agreements_list: any[];
  showBalanceLoader = false;
  agreementOpsError = false;
  agreementSubscription: Subscription;
  navTitle = 'Inscripción de servicios';
  keyEventSubscription: Subscription;

  private _funnel = this.funnelKeysProvider.getKeys().enrolleBills;
  private searchTerms = new Subject<string>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbPlatforms: BdbPlatformsProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private navigation: NavigationProvider,
    private listPaymentAgreementProvider: ListPaymentAgreementDelegate,
    private events: Events,
    private progressBar: ProgressBarProvider
  ) {
    this.title = 'Datos del servicio';
    this.subtitle = 'Nombre de la empresa';
    this.billNameForm = this.formBuilder.group({
      billName: ['', [Validators.required]],
      autoPaymentAgreement: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.showBalanceLoader = false;
    this.agreements$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.listPaymentAgreementProvider.getAgreements(term)),
    );
    this.suscribeAutoComplete();
    this.events.publish('header:title', 'Pago de servicios');
    this.events.publish('srink', true);
    this.progressBar.resetObject();
  }

  ionViewWillEnter(): void {
    this.setKeyEventSubs();
  }

  ionViewWillLeave(): void {
    if (!!this.keyEventSubscription) {
      this.keyEventSubscription.unsubscribe();
    }
  }

  initializeItems() {
    this.itemsBare = this.bdbInMemory.getItemByKey(InMemoryKeys.BillAgreementList);
  }

  suscribeAutoComplete() {
    this.agreementSubscription = this.agreements$.subscribe(e => {
      this.agreements_list = e;
      this.showBalanceLoader = false;
    }, error => {
      this.showBalanceLoader = false;
      this.agreementOpsError = true;
    });
  }

  search(term: string): void {
    this.showBalanceLoader = true;
    if (this.agreementOpsError) {
      this.agreementSubscription.unsubscribe();
      this.suscribeAutoComplete();
    }
    this.searchTerms.next(term);
  }

  triggerBillId() {
    this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.agreement);
    this.navCtrl.push('SubscribeBillIdPage');
  }

  onSelectPaymentAgreement(data) {
    this.billNameForm.controls['billName'].setValue(data.item.name);
    this.itemsBare = [];
    const billCovenant = new BillCovenant();
    billCovenant.covenantNumber = data.item.code;
    billCovenant.image = (!!data.item.urlImage) ? data.item.urlImage.trim() : '';
    this.bdbInMemory.setItemByKey(InMemoryKeys.BillCovenant, billCovenant);
    if (this.bdbPlatforms.isMobile()) {
      this.navCtrl.push('SubscribeBillIdPage');
    }
  }

  public onResetPaymentAgreement(): void {
    this.billNameForm.reset();
    this.itemsBare = [];
  }

  onBackPressed() {
    this.navigation.onBackPressedCustPage(this.navCtrl, 'PaymentsMainPage', 'bills');
  }

  onAbandonClicked() {
    this.navCtrl.setRoot('PaymentsMainPage', {
      tab: 'bills'
    }, {
      animate: true,
      animation: 'ios-transition',
      direction: 'forward'
    });
  }

  private setKeyEventSubs(): void {
    this.keyEventSubscription = fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        filter(keyEvent => keyEvent.code === 'Enter')
      ).subscribe(key => {
        if (this.billNameForm.controls.billName.valid) {
          this.triggerBillId();
        }
      });
  }
}
