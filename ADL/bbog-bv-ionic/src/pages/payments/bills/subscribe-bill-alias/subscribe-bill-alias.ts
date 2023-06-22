import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Tabs, Tab, Loading } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentsProvider } from '../../../../providers/payments/payments';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { BillInfo } from '../../../../app/models/bills/bill-info';
import { BillCovenant } from '../../../../app/models/bills/bill-covenant';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { BdbModalProvider } from '../../../../providers/bdb-modal/bdb-modal';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BillPaymentInfo } from '../../../../app/models/bills/bill-payment-info';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { ViewController } from 'ionic-angular';
import { BdbPlatformsProvider } from '../../../../providers/bdb-platforms/bdb-platforms';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { BdbToastProvider } from '../../../../providers/bdb-toast/bdb-toast';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { BillersPaymentFacade } from '../../../../new-app/modules/payments/store/facades/billers-payment.facade';
import { BdbNormalizeDiacriticDirective } from '../../../../directives/bdb-normalize-diacritic/bdb-normalize-diacritic';

@PageTrack({ title: 'page-subscribe-bill-alias' })
@IonicPage()
@Component({
  selector: 'page-subscribe-bill-alias',
  templateUrl: 'subscribe-bill-alias.html',
})
export class SubscribeBillAliasPage implements OnInit, OnDestroy {

  billAliasForm: FormGroup;
  payNow: boolean;
  title: string;

  abandonText = BdbConstants.ABANDON_PAY;
  navTitle = 'Inscripción de servicios';

  private _funnel = this.funnelKeysProvider.getKeys().enrolleBills;

  private billersPaymentSub$ = new Subscription();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private payments: PaymentsProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbModal: BdbModalProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private navigation: NavigationProvider,
    private loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public bdbPlatforms: BdbPlatformsProvider,
    private bdbToast: BdbToastProvider,
    private billersPaymentFacade: BillersPaymentFacade
  ) { }

  ngOnInit(): void {
    this.billAliasForm = this.formBuilder.group({
      billAlias: ['', [Validators.required]]
    });
    this.title = 'Ingresa un nombre para este servicio';
  }

  ngOnDestroy(): void {
    this.billersPaymentSub$.unsubscribe();
  }

  public onTextChange(event): void {
    event.target.value = BdbNormalizeDiacriticDirective.normalizeDiacriticText(event.target.value);
    this.billAliasForm.controls['billAlias'].setValue(event.target.value);
  }

  getEnrolledBills() {
    let isLoadingHandler = true;
    const load = this.loadingCtrl.create();
    load.present();

    this.billersPaymentFacade.updateBillersPayment();
    this.billersPaymentSub$ = combineLatest(
      this.billersPaymentFacade.billersPaymentMapOld$,
      this.billersPaymentFacade.billersPaymentCompleted$,
      this.billersPaymentFacade.billersPaymentWorking$,
      this.billersPaymentFacade.billersPaymentError$
    ).subscribe(([billInfoList, completed, working, error]) => {

      if (!working && completed && isLoadingHandler) {
        isLoadingHandler = this.checkLoadingActive(load, isLoadingHandler);

        if (this.payNow) {
          const covenant: BillCovenant = this.bdbInMemory.getItemByKey(InMemoryKeys.BillCovenant);
          const bill: BillInfo = billInfoList.find((e: BillInfo) => e.nie === covenant.productId);
          if (bill) {
            this.setBill(bill);
            if (!bill.isInvGen) {
              this.navCtrl.push('bill%amount%input', {
                subscribe: true
              });
            } else {
              if (bill.hasInvoice) {
                this.navCtrl.push('BillSelectPaymentPage', {
                  subscribe: true
                });
              } else {
                this.showErrInvoice();
              }
            }
          } else {
            this.showErrInvoice();
          }
        } else {
          this.onAbandonClicked();
        }

      } else if (!working && !completed && !!error) {
        isLoadingHandler = this.checkLoadingActive(load, isLoadingHandler);
        this.bdbModal.launchErrModal(
          'Servicio no disponible',
          'Intenta más tarde.',
          'Aceptar', () => {
            this.onAbandonClicked();
          }
        );
      }
    });
  }

  private checkLoadingActive(loading: Loading, isLoadingHandler: boolean): boolean {
    if (isLoadingHandler) {
      isLoadingHandler = false;
      loading.dismiss();
    }
    return isLoadingHandler;
  }

  showErrInvoice() {
    this.bdbModal.launchErrModal(
      'No hay factura',
      'No existe una factura disponible para pago',
      'Aceptar',
      () => {
        this.onAbandonClicked();
      }
    );
  }

  setBill(bill: BillInfo) {
    const billPaymentInfo: BillPaymentInfo = new BillPaymentInfo();
    billPaymentInfo.bill = bill;
    billPaymentInfo.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
    this.bdbInMemory.setItemByKey(InMemoryKeys.BillPaymentInfo, billPaymentInfo);
  }

  enrollBill() {
    this.payments.enrollNewBillRq(
      (data) => {
        this.bdbToast.showToast('Servicio inscrito correctamente!');
        this.getEnrolledBills();
      },
      (err) => {
        const errMsg = err && err.error && err.error.message ?
          err.error.message : 'Transacción rechazada. Validar los datos del servicio, comuníquese con la entidad';
        this.bdbModal.launchErrModal(
          'La información no es válida',
          errMsg,
          'Continuar');
      });
  }

  triggerAction(payNow: boolean) {
    this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.alias);
    this.payNow = payNow;
    const covenant: BillCovenant = this.bdbInMemory.getItemByKey(InMemoryKeys.BillCovenant);
    covenant.productName = this.billAliasForm.get('billAlias').value;
    this.bdbInMemory.setItemByKey(InMemoryKeys.BillCovenant, covenant);
    this.enrollBill();
  }

  launchNext(page: string) {
    this.navCtrl.push(page);
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
}
