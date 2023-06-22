import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MobileSummaryProvider } from '../../../../components/mobile-summary';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { TransactionsProvider } from '../../../../providers/transactions/transactions';
import { Cities } from '../../../../app/models/pay/tax';
import { ProviderPila, Bill } from '../../../../app/models/pay/pila';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { DistrictTaxDelegateService } from '../../../../new-app/core/services-delegate/payment-billers-delegate/district-tax-delegate';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';

@IonicPage({
  name: 'page%tax%select',
  segment: 'page-tax-select'
})
@Component({
  selector: 'page-tax-select',
  templateUrl: 'tax-select.html',
})
export class TaxSelectPage {

  formTax: FormGroup;
  listCities: Cities;
  listTax: ProviderPila;
  private _funnel;
  alert_icon: string;
  message_tax: string;
  showMessage: boolean;
  navTitle = 'Pago de impuesto';
  abandonText = BdbConstants.ABANDON_PAY;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private mobileSummary: MobileSummaryProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private progressBar: ProgressBarProvider,
    private transaction: TransactionsProvider,
    private loading: LoadingController,
    private accessDetail: AccessDetailProvider,
    private events: Events,
    private districtTaxDelegateService: DistrictTaxDelegateService,
    private viewRef: ViewContainerRef,
    private genericModalService: GenericModalService,
    private resolver: ComponentFactoryResolver,
  ) {
    this._funnel = this.funnelKeysProvider.getKeys().tax;
    this.buildFormTax();
  }

  ionViewWillEnter() {
    this.mobileSummary.reset();
    this.progressBar.resetObject();
    this.showMessage = false;
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Impuesto');
    if (this.accessDetail.isOriginSelected()) {
      this.accessDetail.updateProgressBarDone(this.accessDetail.getOriginSelected());
    }
    this.events.publish('srink', true);
  }

  ionViewDidLoad() {
    this.message_tax =
    'Este pago está a cargo del Banco de Occidente. Cualquier duda o inquietud comunícate con su línea de atención en Bogotá 307 7027';
    this.alert_icon = 'assets/imgs/promotion.svg';
    this.buildCities();
  }

  private buildFormTax() {
    this.formTax = this.formBuilder.group(
      {
        city: ['', Validators.compose([Validators.required])],
        tax: ['d', Validators.compose([Validators.required])],
        ref: ['', Validators.compose([Validators.required, Validators.minLength(2)])]
      }
    );
  }

  public submit() {
    this.getTaxInfo(this.formTax.value);
  }

  buildCities() {
    const loader = this.loading.create();
    loader.present().then(() => {
    this.districtTaxDelegateService.getDistrictTaxCities().subscribe(d => {
        this.listCities = d;
        loader.dismiss();
      }, err => {
        this.transaction.onError(loader, err);
      });
    });
  }


  buildTaxes(cityId: string) {
    const loader = this.loading.create();
    loader.present().then(() => {
    this.districtTaxDelegateService.getDistrictTaxAgreements(cityId).subscribe(d => {
        this.listTax = d;
        loader.dismiss();
    }, err => {
      if (!!this.listTax) {
        this.listTax.taxes = [];
      }
      this.transaction.onError(loader, err);
    });
    });
  }

  getTaxInfo(data) {
    const loader = this.loading.create();
    loader.present().then(() => {
      this.districtTaxDelegateService.getDistrictTax(data.ref, data.tax.orgIdNum).subscribe(bill => {
        this.gotoSelectAcct(bill);
        loader.dismiss();
      }, err => {
        const taxCodesNewModal = ['190', '191', '192', '109'];
        const validateTaxCode = taxCodesNewModal.find((taxId) => taxId === data.tax.orgIdNum.substr(-3));
        if (err.error && err.error.customerErrorMessage && validateTaxCode) {
          const errorModalMessage = this.buildModalInfo(err.error.customerErrorMessage);
          this.genericModalService.launchGenericModal(this.viewRef, this.resolver, errorModalMessage);
          loader.dismiss();
        } else {
          this.transaction.onError(loader, err);
        }
      });
    });
  }

  gotoSelectAcct(bill: Bill) {
    this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.option);
    const taxInfo = {
      charge: BdbConstants.TRANSACTION_COST.NO_COST,
      dataForm: this.formTax.value,
      taxInfo: { bill },
    };
    this.bdbInMemory.setItemByKey(InMemoryKeys.TaxInfo, taxInfo);
    this.navCtrl.push('page%tax%from%account', {}, {
      animate: true,
      direction: 'forward'
    });
  }

  search(term: string) {
    this.listTax = null;
    if (term === '') {
      this.formTax.get('tax').setValue('d');
    }
  }

  onChangesCity(e): void {
    this.showMessage = false;
    this.buildTaxes(e.item.code);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  validateMessage() {
    const regexp = new RegExp('^(00000190|00000191|00000192|00000109)?$');
    if (this.formTax.value.tax) {
      const svcIdNorm = (this.formTax.value.tax.orgIdNum.length === 3)
      ? `00000${this.formTax.value.tax.orgIdNum}`
      : this.formTax.value.tax.orgIdNum;
      this.showMessage = regexp.test(svcIdNorm);
    }
  }

  private buildModalInfo(errorInformation): GenericModalModel {
    return {
      icon: {
        src: 'assets/imgs/generic-modal/icon-tx-alert.svg',
        alt: 'error'
      },
      modalTitle: errorInformation.title,
      modalInfoData: `<span>${errorInformation.message}</span>`,
      actionButtons: [{
        id: 'generic-btn-key-error',
        buttonText: 'Verificar',
        block: true,
        colorgradient: true,
        action: () => null
      }],
      hideCloseButton: true
    };
  }
}
