import { Component, ComponentFactoryResolver, OnInit, ViewContainerRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { InMemoryKeys } from '../../../../../../../providers/storage/in-memory.keys';
import { BdbMaskProvider, MaskType } from '../../../../../../../providers/bdb-mask';
import { ProgressBarProvider } from '../../../../../../../providers/progress-bar/progress-bar';
import { SelectAccountHandlerProvider } from '../../../../../../../providers/select-account-handler/select-account-handler';
import { DianTaxInfo } from '../../../../models/taxes-info';
import { MobileSummaryProvider } from '../../../../../../../components/mobile-summary';
import { BdbConstants } from '../../../../../../../app/models/bdb-generics/bdb-constants';
import { ProductDetail } from '../../../../../../../app/models/products/product-model';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';

@IonicPage({
  name: 'check%tax%amount',
  segment: 'check-tax-amount'
})
@Component({
  selector: 'check-tax-amount',
  templateUrl: './check-tax-amount.html'
})
export class CheckTaxAmountPage implements OnInit {

   private dianTaxInfo: DianTaxInfo;
   public documentTypeNumberText: string;
   public dateText: string;
   public amountText: string;
   public amountIs0: boolean;
   public isDueDate: boolean;
   public isModalOpen = false;
   private hasAvaliableProducts = false;
   public actionButton: ActionButton;
   public keyEventSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    private progressBar: ProgressBarProvider,
    public mobileSummary: MobileSummaryProvider,
    private bdbStorageService: BdbStorageService,
    private genericModalService: GenericModalService,
    private bdbMask: BdbMaskProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private selectAccountHandler: SelectAccountHandlerProvider,
  ) {}

  ngOnInit(): void {
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_3, false);
  }

  ionViewWillEnter() {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_3, []);
    this.initPageData();
  }

  ionViewDidEnter() {
    const validationOk = !this.isModalOpen && !this.amountIs0 && !this.isDueDate && this.checkAvaliableProducts();
    this.keyEventSubscription = fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(filter(keyEvent => keyEvent.code === 'Enter' && validationOk))
      .subscribe(key => this.doAction());
  }

  ionViewWillLeave(): void {
    if (!!this.keyEventSubscription) {
      this.keyEventSubscription.unsubscribe();
    }
  }

  private initPageData(): void {
    this.dianTaxInfo = this.bdbStorageService.getItemByKey(InMemoryKeys.TaxInfo);
    if (!!this.dianTaxInfo) {
      this.amountIs0 = this.dianTaxInfo.taxInfoDetail.totalCurAmt === '0';
      this.documentTypeNumberText =
        `${this.dianTaxInfo.taxInfoDetail.govIssueIdentType} ${this.bdbMask.removeLeadingZeros(this.dianTaxInfo.taxInfoDetail.identSerialNum)}` ;
      this.isDueDate = this.dianTaxInfo.taxInfoDetail.billStatus === 'InvoiceExpired';
      const limitDate = new Date(this.dianTaxInfo.taxInfoDetail.dueDt.replace(/-/gi, '/'));
      this.amountText = this.bdbMask.maskFormatFactory(
        this.dianTaxInfo.taxInfoDetail.totalCurAmt, MaskType.CURRENCY
      );
      this.dateText = `${limitDate.getDate()}
        de ${this.bdbMask.convertMonthStr(limitDate.getMonth())}
        de ${limitDate.getFullYear()}`;
      this.setActionButton();
      this.validateAvaliableProducts();
    } else {
      this.goTaxSelectionPage();
    }
  }

  private setActionButton(): void {
    this.actionButton = {
      color: this.amountIs0 ? 'warning' : 'primary',
      text: this.amountIs0 ? 'Entendido' : (this.isDueDate ? 'Volver a impuestos' : 'Continuar')
    };
  }

  private validateAvaliableProducts() {
    if (!this.amountIs0 && !this.isDueDate) {
      this.hasAvaliableProducts = this.checkAvaliableProducts();
      if (!this.hasAvaliableProducts) {
        this.launchErrorModal();
      }
    }
  }

  public doAction(): void {
    if (this.amountIs0 || this.isDueDate) {
      this.goTaxSelectionPage();
    } else {
      if (this.hasAvaliableProducts) {
        this.navCtrl.push('select%tax%payment%origin');
      } else {
        this.launchErrorModal();
      }
    }
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

  private checkAvaliableProducts(): boolean {
    const accounts = this.selectAccountHandler.getAccountsAvailable(true) || [];
    const creditCards = this.getAvaliableCreditCards() || [];
    const totalProds = [...accounts, ...creditCards];
    return totalProds.length > 0;
  }

  private getAvaliableCreditCards(): ProductDetail[] {
    let creditCardItems = [];
    try {
      creditCardItems =
        this.bdbStorageService.getItemByKey(InMemoryKeys.CustomerProductList)
          .filter((acct: ProductDetail) => acct.category === BdbConstants.TARJETA_CREDITO_BBOG);
    } catch (error) {}
    return creditCardItems;
  }

  private launchErrorModal(): void {
    const genericModalData: GenericModalModel = {
      icon: {
        src: 'assets/imgs/generic-modal/icon-error-acct.svg',
        alt: 'error'
      },
      modalTitle: 'No tienes productos para pagar',
      modalInfoData: `<span>Actualmente no tienes Cuentas de Ahorro o Tarjetas de Crédito para pagar el impuesto.</span>`,
      actionButtons: [
        {
          id: 'generic-btn-action-1',
          buttonText: 'Entendido',
          block: true,
          colorgradient: true,
          action: () => {
            this.isModalOpen = false;
            this.goTaxSelectionPage();
          }
        }
      ]
    };
    this.isModalOpen = true;
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }

}

interface ActionButton {
  color: string;
  text: string;
}
