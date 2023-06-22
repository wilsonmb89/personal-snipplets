import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Events, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { BillInfo } from '../../../../app/models/bills/bill-info';
import { BillPaymentInfo } from '../../../../app/models/bills/bill-payment-info';
import { BdbItemCardModel } from '../../../../components/bdb-item-card-v2/bdb-item-card-v2';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { BdbModalProvider } from '../../../../providers/bdb-modal/bdb-modal';
import { BdbPlatformsProvider } from '../../../../providers/bdb-platforms/bdb-platforms';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { BillOpsProvider } from '../../../../providers/bill-ops/bill-ops';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { TokenOtpProvider } from '../../../../providers/token-otp/token-otp/token-otp';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { BillersPaymentFacade } from '../../../../new-app/modules/payments/store/facades/billers-payment.facade';
import { BillersPaymentService } from '../../../../new-app/modules/payments/services/billers-payment.service';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { PulseToastService } from '@app/shared/components/pulse-toast/provider/pulse-toast.service';
import { catchError } from 'rxjs/operators';


@PageTrack({title: 'page-bill-selelect'})
@Component({
  selector: 'page-bill-selelect',
  templateUrl: 'bill-selelect.html',
})
export class BillSelelectPage implements OnInit, OnDestroy {

  subtitle = '¿Cuál servicio vas a pagar?';
  abandonText = BdbConstants.ABANDON_PAY;
  billsCard: BdbItemCardModel[] = [];
  billList: Array<BillInfo>;
  counter: number;
  showBillsLoader = false;

  dataEmpty = {
    img: {
      desktop: 'empty-states/bills.svg',
      mobile: 'empty-states/bills.svg'
    },
    message: 'Inscribe tus facturas de servicios públicos y pagalos sin salir de casa.',
    button: {
      message: 'Inscribir servicio',
      callback: () => {
        this.enrollBill();
      }
    }
  };

  private _funnel = this.funnelKeysProvider.getKeys().bills;
  private _funnelEnroll = this.funnelKeysProvider.getKeys().enrolleBills;

  sortingBillsHasInvoice$: Observable<BdbItemCardModel[]> = this.billersPaymentFacade.sortingBillsHasInvoice$;
  billsNotHasInvoice$: Observable<BdbItemCardModel[]> = this.billersPaymentFacade.billsNotHasInvoice$;
  billersPaymentWorking$: Observable<boolean> = this.billersPaymentFacade.billersPaymentWorking$;
  billersPaymentCompleted$: Observable<boolean> = this.billersPaymentFacade.billersPaymentCompleted$;

  private billersPaymentSub$ = new Subscription();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbUtils: BdbUtilsProvider,
    public modalCtrl: ModalController,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private accessDetail: AccessDetailProvider,
    private bdbModal: BdbModalProvider,
    private billOps: BillOpsProvider,
    private events: Events,
    public bdbPlatforms: BdbPlatformsProvider,
    private tokenOtp: TokenOtpProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private billersPaymentFacade: BillersPaymentFacade,
    private billersPaymentService: BillersPaymentService,
    private genericModalService: GenericModalService,
    private pulseToastService: PulseToastService,
    private loadingCtrl: LoadingController
  ) {
  }

  ngOnInit() {
    this.counter = 0;
    this.bdbInMemory.setItemByKey(InMemoryKeys.PaymentOrigin, 'bills');
    this.billersPaymentFacade.fetchBillersPayment();
    this.billersPaymentSub$ = combineLatest(
      this.billersPaymentFacade.billersPaymentCompleted$,
      this.billersPaymentFacade.billersPaymentWorking$,
      this.billersPaymentFacade.billersPaymentError$
    ).subscribe(([completed, working, error]) => {

      if (!working && !completed && !!error) {
        this.bdbModal.launchErrModal(
          'Servicio no disponible',
          'Intenta más tarde.',
          'Aceptar'
        );
      }

    });

    if (this.accessDetail.isOriginSelected()) {
      this.accessDetail.updateProgressBarDone(this.accessDetail.getOriginSelected());
    }
    this.events.publish('header:btn:remove', 'left');
  }

  ngOnDestroy(): void {
    this.billersPaymentSub$.unsubscribe();
  }

  processSelection(bill: BillInfo) {
    if (!bill.hasInvoice && bill.isInvGen) {
      this.noBillerAvaliable();
      return;
    }
    this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.pickBill);
    const billPaymentInfo: BillPaymentInfo = new BillPaymentInfo();
    billPaymentInfo.bill = bill;
    billPaymentInfo.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
    this.bdbInMemory.setItemByKey(InMemoryKeys.BillPaymentInfo, billPaymentInfo);
    let i;
    if (bill.isInvGen) {
      i = {
        template: 'BillSelectPaymentPage'
      };
    } else {
      i = {
        template: 'bill%amount%input'
      };
    }
    this.navCtrl.push(i.template);
  }

  enrollBill() {
    this.funnelEventsProvider.callFunnel(this._funnelEnroll, this._funnelEnroll.steps.pickEnroll);
    this.tokenOtp.requestToken(
      this.viewRef,
      this.resolver,
      () => {
        this.navCtrl.push('suscribe%bill%name', {template: 'suscribe%bill%name'});
      },
      'billInscription'
    );
  }

  getColor(index: number): string {
    return this.bdbUtils.getRandomColor(index);
  }

  onContextSelection(event, bill: BillInfo) {
    const option = event.key ? event.key : event.event.key;
    switch (option) {
      case 'mod': {
        this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.schedule);
        this.navCtrl.push('ScheduleBillPage', {item: bill});
        break;
      }
      case 'sched': {
        this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.schedule);
        this.navCtrl.push('ScheduleBillPage', {item: bill, newSchedule: true});
        break;
      }
      case 'delete': {
        this.deleteBillAction(bill);
        break;
      }
      case 'paid-out': {
        this.paidOutAction(bill);
        break;
      }
    }
  }

  private paidOutAction(bill: BillInfo): void {

    const genericModalData: GenericModalModel = {
      icon: {
        src: 'assets/imgs/generic-modal/icon-tx-alert.svg',
        alt: 'error'
      },
      modalTitle: '¿Pagaste por otro medio este servicio?',
      modalInfoData: `Si lo marcas, este servicio desaparecerá como pendiente de tus pagos por este mes<br><br>
                      Recuerda: esta acción no se puede deshacer.<br><br>
                      ¿Deseas marcarlo como pagado?<br><br>`,
      actionButtons: [
        {
          id: 'generic-btn-action-1',
          buttonText: 'No, cancelar',
          block: true,
          fill: 'outline',
          colorgradient: true,
          action: () => {
          }
        },
        {
          id: 'generic-btn-action-2',
          buttonText: 'Si, continuar',
          block: true,
          colorgradient: true,
          action: () => {
            this.continueMarkServiceAsPayment(bill);
          }
        }
      ]
    };
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }

  private continueMarkServiceAsPayment(bill: BillInfo): void {
    const load = this.loadingCtrl.create();

    load.present();

    this.billersPaymentService.deleteInvoice(bill).subscribe(data => {
      load.dismiss();

      this.billersPaymentFacade.updateBillersPayment();
      this.pulseToastService.create({
        text: 'Tu servicio fue marcado como pagado.',
        color: 'success',
        image: 'assets/imgs/toast/ticket.svg',
        closeable: true,
      });
    }, e => {
      this.pulseToastService.create({
        text: 'No se pudo marcar tu servicio. Inténtalo más tarde.',
        color: 'error',
        image: 'assets/imgs/toast/info.svg',
        closeable: true,
      });
    });

  }

  deleteBillAction(bill: BillInfo): void {
    this.bdbModal.launchErrModal(
      'Eliminar servicio',
      'Si lo haces, deberás inscribirla nuevamente para realizar pagos.',
      'Eliminar',
      (data) => {
        if (data === 'Eliminar') {
          this.billersPaymentService.deleteBill(bill).subscribe(
            res => {
              this.billersPaymentFacade.updateBillersPayment();
            },
            err => {
              this.bdbModal.launchErrModal(
                'No se pudo eliminar el producto',
                'Por favor intenta de nuevo más tarde',
                'Aceptar');
            }
          );
        }
      },
      'Cancelar');
  }

  private noBillerAvaliable(): void {
    this.bdbModal.launchErrModal(
      'No hay factura',
      'No existe una factura disponible para pago',
      'Aceptar',
      () => {
      }
    );
  }

}
