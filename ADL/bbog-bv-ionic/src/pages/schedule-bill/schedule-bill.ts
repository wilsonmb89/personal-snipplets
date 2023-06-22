import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Events } from 'ionic-angular';
import { PageTrack } from '../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { BdbToastOptions } from '../../app/models/bdb-toast-options';
import { BillInfo } from '../../app/models/bills/bill-info';
import { ProductDetail } from '../../app/models/products/product-model';
import { SchedBillAdd } from '../../app/models/sched-bill/sched-bill.model';
import { BdbGenericScheduleCardComponent } from '../../components/bdb-generic-schedule-card/bdb-generic-schedule-card';
import { BdbItemCardModel } from '../../components/bdb-item-card-v2/bdb-item-card-v2';
import { BdbMaskProvider } from '../../providers/bdb-mask/bdb-mask';
import { MaskType } from '../../providers/bdb-mask/bdb-mask-type.enum';
import { BdbModalProvider } from '../../providers/bdb-modal/bdb-modal';
import { BdbToastProvider } from '../../providers/bdb-toast/bdb-toast';
import { BillOpsProvider } from '../../providers/bill-ops/bill-ops';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { BillersPaymentFacade } from '../../new-app/modules/payments/store/facades/billers-payment.facade';

@PageTrack({ title: 'schedule-bill' })
@IonicPage()
@Component({
  selector: 'page-schedule-bill',
  templateUrl: 'schedule-bill.html',
})
export class ScheduleBillPage {

  private ENDPOINT_MODIFY = 'payment-core/recurring-payment/edit';
  private ENDPOINT_ADD = 'payment-core/recurring-payment/add';
  private ENDPOINT_REMOVE = 'payment-core/recurring-payment/remove';
  @ViewChild('schedcard') schedCard: BdbGenericScheduleCardComponent;
  private item: BdbItemCardModel;
  private isNewSchedule = false;
  private billToSchedule: BillInfo;
  validAccounts: any;

  private defaultSuccessToast: BdbToastOptions = {
    message: 'Tu pago se ha programado con éxito.',
    close: true,
    color: 'active-green',
    type: 'success'
  };

  private defaultErrorToast = {
    msg: 'No se realizo la programación del pago.',
    toastClass: 'toast-warning',
    closeButtonText: 'Volver a intentar',
    callback: () => {
      this.saveChanges();
    }
  };

  navTitle = 'Programar pago de servicio';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbMask: BdbMaskProvider,
    private billOps: BillOpsProvider,
    private bdbToast: BdbToastProvider,
    private loadingCtrl: LoadingController,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbModal: BdbModalProvider,
    private events: Events,
    private billersPaymentFacade: BillersPaymentFacade
  ) {
    this.billToSchedule = navParams.get('item');

    if (this.billToSchedule !== undefined) {
      this.item = this.mapToCard(this.billToSchedule);
    }
    const n = navParams.get('newSchedule');
    if (n) {
      this.isNewSchedule = n;
    }

    const customerProds: ProductDetail[] = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    this.validAccounts = customerProds.filter((e: ProductDetail) => {
      return e.productType === BdbConstants.ATH_SAVINGS_ACCOUNT || e.productType === BdbConstants.ATH_CHECK_ACCOUNT;
    });
    this.events.publish('srink', true);
  }

  private mapToCard(e: BillInfo): BdbItemCardModel {
    if (!e.isInvGen) {
      return {
        contraction: e.contraction,
        title: e.nickname,
        desc: [
          e.orgInfoName,
          `No. ${e.nie}`
        ],
        product: e,
        withContextMenu: false,
        contextMenuList: [],
        isScheduled: e.scheduled,
        avatarColor: '#f89b1b',
        showLogo: false,
        details: [],
        isFavorite: false,
        logoPath: null,
        withFavorite: false,
        account: e.account
      };
    } else {
      const cardDesc = [
        e.orgInfoName,
        `No. ${e.nie}`
      ];
      let details = [];

      if (e.hasInvoice) {
        details = [{
          key: 'Valor a pagar:',
          value: this.bdbMask.maskFormatFactory(e.amt, MaskType.CURRENCY)
        },
        {
          key: 'Fecha de pago:',
          value: this.bdbMask.maskFormatFactory(e.dueDt, MaskType.DATE)
        }];
      }
      return {
        contraction: e.contraction,
        title: e.nickname,
        desc: cardDesc,
        details,
        product: e,
        withContextMenu: false,
        contextMenuList: [],
        isScheduled: e.scheduled,
        avatarColor: '#f89b1b',
        showLogo: false,
        isFavorite: false,
        logoPath: null,
        withFavorite: false,
        account: e.account
      };
    }
  }

  public onCancel(): void {
    this.navCtrl.popToRoot();
  }

  public saveChanges(
    remove = false,
    url = this.ENDPOINT_ADD,
    successToast = this.defaultSuccessToast,
    errorToast = this.defaultErrorToast
  ): void {
    const load = this.loadingCtrl.create();
    load.present();
    const s = this.schedCard.formScheduleInfo.getRawValue();
    const rq: SchedBillAdd = this.billOps.buildScheduleBillRq(this.billToSchedule, s, this.validAccounts);

    if (!this.isNewSchedule && url !== this.ENDPOINT_REMOVE) {
      url = this.ENDPOINT_MODIFY;
    }

    this.billOps.schedBill(rq, url).subscribe(
      (data) => {
        load.dismiss();
        this.billersPaymentFacade.updateBillersPayment();
        this.bdbToast.showToastGeneric(successToast);
        this.navCtrl.popToRoot();
      },
      (err) => {
        load.dismiss();
        this.bdbToast.showToastV2(
          errorToast.msg,
          errorToast.toastClass,
          errorToast.closeButtonText,
          errorToast.callback
        );
      }
    );
  }

  public deleteSchedule(): void {

    const data = {
      title: 'Eliminar programación',
      subtitle: 'Al eliminar el pago programado no se realizarán los pagos futuros del servicio.',
      buttons: [
        {
          text: 'Cancelar',
          outline: true
        },
        {
          text: 'Sí, eliminar',
          callback: () => {

            const successToast: BdbToastOptions = {
              message: 'Se ha eliminado la programación del pago.',
              close: true,
              color: 'white-toast',
              type: 'delete'
            };

            const errorToast = {
              msg: 'No se eliminó la programación del pago.',
              toastClass: 'toast-warning',
              closeButtonText: 'Volver a intentar',
              callback: () => {
                this.saveChanges(
                  true,
                  this.ENDPOINT_REMOVE,
                  successToast,
                  errorToast
                );
              }
            };

            this.saveChanges(
              true,
              this.ENDPOINT_REMOVE,
              successToast,
              errorToast
            );
          }
        }
      ]
    };

    this.bdbModal.launchModalFlowConfirmation(data);
  }
}
