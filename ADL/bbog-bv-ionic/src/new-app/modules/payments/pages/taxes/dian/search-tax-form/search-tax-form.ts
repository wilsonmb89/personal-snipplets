import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Events, IonicPage, LoadingController, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { filter } from 'rxjs/operators';

import { DianTaxInfo, TaxInfo } from '../../../../models/taxes-info';
import { BdbConstants } from '../../../../../../../app/models/bdb-generics/bdb-constants';
import { ProgressBarProvider } from '../../../../../../../providers/progress-bar/progress-bar';
import { InMemoryKeys } from '../../../../../../../providers/storage/in-memory.keys';
import { BdbMaskProvider, MaskType } from '../../../../../../../providers/bdb-mask';
import { TooltipInfoOpsProvider } from '@app/shared/utils/bdb-pulse-ops-services/tooltip-info-ops';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { PulseTooltipInfoData, TooltipInfoOptions } from '@app/shared/utils/bdb-pulse-ops-services/models/tooltip-info-options.model';
import { GenericModalModel, AdditionalInfo } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { MobileSummaryProvider, SummaryHeader, SummaryBody } from '../../../../../../../components/mobile-summary';
import { CheckPaymentTaxDelegateService } from '@app/delegate/payment-billers-delegate/check-payment-tax-delegate.service';
import { CheckPaymentTaxRs, InvoiceInfoDetail } from '../../../../../../../new-app/core/services-apis/payment-billers/models/payment-billers-api.model';

@IonicPage({
  name: 'search%tax%form',
  segment: 'search-tax-form'
})
@Component({
  selector: 'search-tax-form',
  templateUrl: './search-tax-form.html'
})
export class SearchTaxFormPage implements OnInit {

  @ViewChild('ppalContainer') ppalContainer;

  searchTaxForm: FormGroup;
  paymentTypes: PaymentTypeOption[] = [];
  isModalOpen = false;
  isLoading = false;
  searchTaxFormSubscription: Subscription;
  keyEventSubscription: Subscription;

  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private tooltipInfoOpsProvider: TooltipInfoOpsProvider,
    private progressBar: ProgressBarProvider,
    private mobileSummary: MobileSummaryProvider,
    private bdbMask: BdbMaskProvider,
    private genericModalService: GenericModalService,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private bdbStorageService: BdbStorageService,
    private events: Events,
    private checkPaymentTaxService: CheckPaymentTaxDelegateService,
    private loading: LoadingController,
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.buildPaymentTypeOptions();
    this.addFormEvents();
  }

  ionViewWillEnter() {
    this.initProgressBar();
    this.events.publish('srink', true);
  }

  ionViewDidEnter() {
    this.keyEventSubscription = fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        filter(keyEvent => keyEvent.code === 'Enter' && !this.isLoading && !this.isModalOpen)
      ).subscribe(key => this.submit());
    this.ppalContainer.nativeElement
      .addEventListener('scroll', () => this.tooltipInfoOpsProvider.recalcTooltip());
  }

  ionViewWillLeave() {
    if (!!this.searchTaxFormSubscription) {
      this.searchTaxFormSubscription.unsubscribe();
    }
    if (!!this.keyEventSubscription) {
      this.keyEventSubscription.unsubscribe();
    }
    this.tooltipInfoOpsProvider.removeAllTooltip();
  }

  private buildForm(): void {
    this.searchTaxForm = this.formBuilder.group({
      paymentType: ['T'],
      formNumber: ['', [Validators.required]]
    });
  }

  private buildPaymentTypeOptions(): void {
    this.paymentTypes = [
      {
        selected: true,
        name: 'Tributario',
        value: 'T'
      },
      {
        selected: false,
        name: 'Aduanero',
        value: 'A'
      }
    ];
  }

  private initProgressBar(): void {
    this.progressBar.resetObject();
    this.progressBar.init(
      'Impuesto DIAN',
      BdbConstants.PROGBAR_STEP_1,
      'Datos del impuesto',
      [this.paymentTypes
        .find(type => type.value === this.searchTaxForm.get('paymentType').value).name,
        !!this.searchTaxForm.get('formNumber').value ? `No. ${this.searchTaxForm.get('formNumber').value}` : ''
      ],
      { isDone: true, pathLogo: '' });
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Valor a pagar');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_3, 'Cuenta origen');
  }

  private buildHeaderMobileSummary(details?: Array<string>) {
    const header: SummaryHeader = new SummaryHeader();
    header.title = 'Impuesto DIAN';
    header.hasContraction = true;
    header.contraction = 'Impuesto DIAN';
    header.details = details;
    this.mobileSummary.setHeader(header);
  }

  private addFormEvents(): void {
    this.searchTaxFormSubscription = this.searchTaxForm.valueChanges.subscribe(
      changeData => {
        const progressDetail: Array<string> = [];
        progressDetail.push(this.paymentTypes.find(type => type.value === changeData.paymentType).name);
        if (!!changeData.formNumber) {
          progressDetail.push(`No. ${changeData.formNumber}`);
        }
        this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, progressDetail);
        this.buildHeaderMobileSummary(progressDetail);
      }
    );
  }

  private launchErrorModal(
    imgSrcPath: string,
    title: string,
    description: string,
    actionText: string,
    actionModal: () => void,
    additionalInfo?: AdditionalInfo,
  ): void {
    const genericModalData: GenericModalModel = {
      icon: {
        src: imgSrcPath,
        alt: 'error'
      },
      modalTitle: title,
      modalInfoData: `<span>${description}</span>`,
      additionalModalData: additionalInfo,
      actionButtons: [
        {
          id: 'generic-btn-action-1',
          buttonText: actionText,
          block: true,
          colorgradient: true,
          action: actionModal
        }
      ]
    };
    this.isModalOpen = true;
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }

  private launchNotFoundFormErrorModal(): void {
    this.launchErrorModal(
      'assets/imgs/generic-modal/icon-file-warning.svg',
      'Los datos no coinciden',
      'Por favor vuelve a digitar los datos y verifica que sean iguales como aparecen en tu formulario.',
      'Entendido',
      () => {
        this.isModalOpen = false;
      },
      {
        icon: { src: 'assets/imgs/token-otp/token/advice.svg', alt: 'alert'},
        additionalInfoData: `<span class='pulse-tp-hl5-comp-b'>Recuerda que:</span><br>
        <span class='pulse-tp-hl5-comp-b'>- Tributario</span>, es para todo lo relacionado con declaración de renta.<br>
        <span class='pulse-tp-hl5-comp-b'>- Aduanero</span>, es para importaciones y exportaciones.`
      }
    );
  }

  private launchErrorFoundFormModal(): void {
    this.launchErrorModal(
      'assets/imgs/generic-modal/icon-error-acct.svg',
      'Algo ha sucedido',
      'Estamos teniendo inconvenientes pagando tu impuesto. Por favor, inténtalo más tarde.',
      'Entendido',
      () => {
        this.isModalOpen = false;
        this.goTaxSelectionPage();
      }
    );
  }

  private saveData(dianTaxInfo: DianTaxInfo) {
    this.bdbStorageService.setItemByKey(InMemoryKeys.TaxInfo, dianTaxInfo);
  }

  private buildDianTaxInfo(): DianTaxInfo {
    const dianTaxInfo = new DianTaxInfo();
    dianTaxInfo.taxInfo = new TaxInfo();
    dianTaxInfo.taxInfo.invoiceNum = this.searchTaxForm.get('formNumber').value;
    dianTaxInfo.taxInfo.taxCode = this.searchTaxForm.get('paymentType').value;
    dianTaxInfo.taxInfo.taxName = this.paymentTypes.find(type => type.value === this.searchTaxForm.get('paymentType').value).name;
    return dianTaxInfo;
  }

  private buildBodyMobileSummary(amount: string) {
    const body: SummaryBody = new SummaryBody();
    body.textUp = 'Valor a pagar:';
    body.valueUp = this.bdbMask.maskFormatFactory(amount, MaskType.CURRENCY);
    body.textDown = 'Costo de transacción (sin IVA)';
    body.valueDown = 'Gratis';
    this.mobileSummary.setBody(body);
  }

  private updateProgressBarAmt(amount: string): void {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, [
      this.bdbMask.maskFormatFactory(amount, MaskType.CURRENCY),
      'Costo: Gratis'
    ]);
  }

  public goPreviousPage(): void {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.goTaxSelectionPage();
    }
  }

  public goTaxSelectionPage(): void {
    this.navCtrl.setRoot(
      'PaymentsMainPage', { 'tab': 'tax' }
    );
  }

  public showTooltip(htmlElement: HTMLElement): void {
    const tooltipInfo = new Array<PulseTooltipInfoData>();
    tooltipInfo.push({title: 'Tributario:', description: 'Corresponde a la declaración de renta.'});
    tooltipInfo.push({title: 'Aduanero:', description: 'Relacionado con exportaciones e importaciones.'});
    const tooltipOptions: TooltipInfoOptions = {
      content: tooltipInfo,
      htmlelementref: htmlElement,
      id: 'stf_tooltip_1',
      orientation: 'right-start',
      size: 's'
    };
    this.tooltipInfoOpsProvider.presentToolTip(tooltipOptions).subscribe();
  }

  public submit(): void {
    if (this.searchTaxForm.valid) {
      const loading = this.loading.create();
      loading.present();
      this.isLoading = true;
      const dianTaxInfo = this.buildDianTaxInfo();
      this.checkPaymentTaxService.checkPaymentTax(dianTaxInfo).subscribe({
        next: (taxInfoRs) => {
          this.processSuccessData(taxInfoRs, dianTaxInfo);
          this.navCtrl.push('check%tax%amount');
          this.isLoading = false;
          loading.dismiss();
        },
        error: (error) => {
          loading.dismiss();
          this.isLoading = false;
          try {
            if (!!error && !!error.error && error.error.businessErrorCode !== 'INTERNAL_SERVER_ERROR') {
              this.launchNotFoundFormErrorModal();
            } else {
              this.launchErrorFoundFormModal();
            }
          } catch (err) {
            this.launchErrorFoundFormModal();
          }
        }
      });
    }
  }

  private processSuccessData(taxInfo: CheckPaymentTaxRs, dianTaxInfo: DianTaxInfo) {
    if (!!taxInfo.invoiceInfoDetails && taxInfo.invoiceInfoDetails.length > 0) {
      const taxInfoDetail: InvoiceInfoDetail = taxInfo.invoiceInfoDetails[0];
      dianTaxInfo.taxInfoDetail = taxInfoDetail;
      this.saveData(dianTaxInfo);
      this.buildBodyMobileSummary(taxInfoDetail.totalCurAmt);
      this.updateProgressBarAmt(taxInfoDetail.totalCurAmt);
    }
  }

  public changePaymentType(value: string): void {
    this.paymentTypes.forEach(paymentType => {
      paymentType.selected = paymentType.value === value;
    });
    this.searchTaxForm.get('paymentType').setValue(value);
  }

}

interface PaymentTypeOption {
  selected: boolean;
  name: string;
  value: string;
}
