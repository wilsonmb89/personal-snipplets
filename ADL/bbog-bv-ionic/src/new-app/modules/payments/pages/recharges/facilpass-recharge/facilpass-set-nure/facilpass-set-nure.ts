import { Component, ComponentFactoryResolver, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Events, IonicPage, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { BdbConstants } from '../../../../../../../app/models/bdb-generics/bdb-constants';
import { MobileSummaryProvider, SummaryHeader } from '../../../../../../../components/mobile-summary';
import { ProgressBarProvider } from '../../../../../../../providers/progress-bar/progress-bar';
import { FacipassRechargeRq } from '@app/apis/payment-nonbillers/models/facilpass-recharge.model';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { InMemoryKeys } from '../../../../../../../providers/storage/in-memory.keys';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { SelectAccountHandlerProvider } from '../../../../../../../providers/select-account-handler/select-account-handler';

@IonicPage({
  name: 'facilpass%set%nure',
  segment: 'facilpass-set-nure'
})
@Component({
  selector: 'facilpass-set-nure-page',
  templateUrl: './facilpass-set-nure.html'
})
export class FacilpassSetNurePage implements OnInit {

  private readonly facilpassLogo = 'assets/imgs/payments/recharges/facilpass-logo.svg';
  private nureForm: FormGroup;
  private nureFormSubscription: Subscription;
  nureState = 'basic';
  nureLabelHelper = '';

  constructor(
    private events: Events,
    private navCtrl: NavController,
    private progressBar: ProgressBarProvider,
    public mobileSummary: MobileSummaryProvider,
    private formBuilder: FormBuilder,
    private bdbStorageService: BdbStorageService,
    private genericModalService: GenericModalService,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private selectAccountHandler: SelectAccountHandlerProvider,
  ) {
    this.nureForm = this.formBuilder.group({
      nure: new FormControl('', [Validators.required, Validators.minLength(9)])
    });
  }

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.initPageData();
    this.getAvaliableAccounts();
    this.events.publish('srink', true);
  }

  ionViewWillLeave(): void {
    if (!!this.nureFormSubscription) {
      this.nureFormSubscription.unsubscribe();
    }
  }

  public goPreviousPage(): void {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.goToRechargesPage();
    }
  }

  private buildHeaderMobileSummary(details?: Array<string>) {
    const header: SummaryHeader = new SummaryHeader();
    header.title = 'FacilPass';
    header.logoPath = this.facilpassLogo;
    header.details = details;
    this.mobileSummary.setHeader(header);
  }

  private addFormEvents(): void {
    this.nureFormSubscription = this.nureForm.valueChanges.subscribe(
      ({ nure }) => {
        const progressDetail: string[] = !!nure ? [`NURE: ${nure}`] : [];
        this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, progressDetail);
        this.buildHeaderMobileSummary(progressDetail);
      }
    );
  }

  private setUpProgressBars(): void {
    this.initProgressBar();
    this.buildHeaderMobileSummary();
    const nureValue = this.nureForm.get('nure').value;
    this.progressBar.setDetails(
      BdbConstants.PROGBAR_STEP_1,
      !!nureValue ? [`NURE: ${nureValue}`] : []
    );
  }

  private initProgressBar(): void {
    this.progressBar.resetObject();
    this.progressBar.setLogo(this.facilpassLogo);
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'FacilPass');
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Valor de la recarga');
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, null);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, false);
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_3, 'Cuenta origen');
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_3, null);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_3, false);
  }

  public goToRechargesPage(): void {
    this.navCtrl.setRoot(
      'PaymentsMainPage', { 'tab': 'recharge' }
    );
  }

  public onInputKeyDown(ev: CustomEvent): void {
    const keyValidator = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'e'];
    const isValid = keyValidator.filter(e => e === ev.detail.key).length > 0;
    const lengthInput = ev.detail.srcElement.value.length;
    if (lengthInput === 9 && isValid ||
      ev.detail.key === 'e' || ev.detail.key === '-' || ev.detail.key === '.') {
      document.onkeydown = () => false;
    }
  }

  public onInputKeyUp(): void {
    this.keyUpValidateNure();
    document.onkeydown = e => e;
  }

  private keyUpValidateNure(): void {
    const nureVal: string = this.nureForm.get('nure').value || '';
    if (nureVal.length === 9) {
      this.nureState = 'basic';
      this.nureLabelHelper = '';
    }
  }

  public onSubmitFormNure(): void {
    if (!!this.nureForm && this.nureForm.valid) {
      this.saveNureData();
      this.navCtrl.push('facilpass%set%amount');
    }
  }

  private saveNureData(): void {
    const facilpassData: FacipassRechargeRq = {
      codeNIE: this.nureForm.get('nure').value,
      amount: null,
      account: null,
      trxForce: false
    };
    this.bdbStorageService.setItemByKey(InMemoryKeys.FacilpassData, facilpassData);
  }

  private initPageData(): void {
    this.setUpProgressBars();
    this.addFormEvents();
  }

  public validateNure(): void {
    const nureValid = this.nureForm.get('nure').valid;
    this.nureState = nureValid ? 'basic' : 'error';
    this.nureLabelHelper = nureValid ? '' : 'Debes ingresar 9 dígitos.';
  }

  private getAvaliableAccounts(): void {
    const accounts = this.selectAccountHandler.getAccountsAvailable(true);
    if (!!accounts && accounts.length <= 0) {
      this.launchGenericErrorModal();
    }
  }

  private launchGenericErrorModal(): void {
    this.launchErrorModal(
      'assets/imgs/shared/error-modal/alert-icon.svg',
      'Algo ha ocurrido.',
      'En este momento la operación no puede realizar. Por favor intenta más tarde.',
      'Entendido',
      () => this.navCtrl.setRoot('DashboardPage')
    );
  }

  private launchErrorModal(
    imgSrcPath: string,
    title: string,
    description: string,
    actionText: string,
    actionModal: () => void
  ): void {
    const genericModalData: GenericModalModel = {
      icon: {
        src: imgSrcPath,
        alt: 'warning'
      },
      modalTitle: title,
      modalInfoData: `<span>${description}</span>`,
      actionButtons: [
        {
          id: 'generic-btn-action-1',
          buttonText: actionText,
          block: true,
          action: actionModal
        }
      ]
    };
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }
}
