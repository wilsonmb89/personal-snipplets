import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Events } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { BdbItemCardModel } from '../../../../components/bdb-item-card-v2/bdb-item-card-v2';
import { BdbPdfProvider } from '../../../../providers/bdb-pdf/bdb-pdf';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { IdType } from '../../../../providers/bdb-utils/id-type.enum';
import { EncryptionIdType } from '../../../../providers/bdb-utils/encryption-id.enum';
import { Customer } from '../../../../app/models/bdb-generics/customer';
import { HttpErrorResponse } from '@angular/common/http';
import { TaxCertificateDelegateService } from '@app/delegate/documents/tax-certificate-delegate.service';
import { ProductExtractsRs } from '../../../../app/models/extracts/product-extracts-response';
import {
  ServiceApiErrorModalService
} from '@app/shared/components/modals/service-api-error-modal/provider/service-api-error-modal.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import {BankStatementRequest} from '@app/apis/banking-reports/models/account-statement.model';

@PageTrack({ title: 'certificate-download' })
@IonicPage()
@Component({
  selector: 'page-certificate-download',
  templateUrl: 'certificate-download.html',
})
export class CertificateDownloadPage {
  certselected;
  headItem: BdbItemCardModel;
  extractRq: BankStatementRequest;
  periodList = [];
  rawAcct: ProductDetail;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private loadingController: LoadingController,
    private bdbPdf: BdbPdfProvider,
    private bdbUtils: BdbUtilsProvider,
    private events: Events,
    private taxCertificateDelegateService: TaxCertificateDelegateService,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private serviceApiErrorModalService: ServiceApiErrorModalService,
  ) { }

  ionViewWillEnter() {
    this.events.publish('srink', true);
  }

  ionViewDidLoad() {
    this.certselected = this.bdbInMemory.getItemByKey(InMemoryKeys.CertificatesSelected);
    const desc = !!this.certselected.product ?
      [`${this.certselected.product.productName}  No. ${this.certselected.product.productNumber}`] : undefined;
    this.headItem = {
      title: this.certselected.cardTitle,
      desc,
      logoPath: this.certselected.cardIcon,
      showLogo: true
    };
    this.fillPeriod((new Date()).getFullYear() - 1);
  }

  private fillPeriod(year) {
    this.periodList = [
      {
        value: `${year}-01-02T00:00:00`,
        name: `${year}`,
        selected: false
      },
      {
        value: `${year - 1}-01-02T00:00:00`,
        name: `${year - 1}`,
        selected: false
      }
    ];
  }

  clearSelection() {
    this.periodList.forEach(p => p.selected = false);
  }

  onItemClick(item) {
    this.clearSelection();
    item.selected = true;
    const loading = this.loadingController.create();
    this.extractRq = this.buildCertificateRq(item);

    loading.present().then(() => {

      this.taxCertificateDelegateService
        .getCertificate(this.extractRq)
        .subscribe(
          (data: ProductExtractsRs) => {
            loading.dismiss();

            this.bdbPdf
              .createPdf(
                data,
                this.rawAcct,
                this.extractRq.startDate,
                'CERTIFICADO_'
              ).subscribe(e => this.clearSelection());
          },
          (ex: HttpErrorResponse) => {
            loading.dismiss();
            this.clearSelection();
            const errorData: ApiGatewayError = ex.error ? ex.error : null;
            this.serviceApiErrorModalService.launchErrorModal(
              this.viewRef,
              this.resolver,
              !!errorData ? errorData.customerErrorMessage : null
            );
          });
    });
  }

  private buildCertificateRq(item): BankStatementRequest {
  const customer: Customer = this.bdbUtils.getCustomer(IdType.BUS_BDB, EncryptionIdType.NONE);
     return {
      startDate: item.value,
      docFormat: this.certselected.typeNemo,
      acctId: !!this.certselected.product ? this.validateAcctIdCardSelectedInfo() : customer.identificationNumber,
      acctType: !!this.certselected.product ? this.validateAcctTypeCardSelectedInfo() : this.certselected.typeNemo
    };
  }

  private validateAcctIdCardSelectedInfo(): string {
    return !!this.certselected.product.productDetailApi ?
    this.certselected.product.productDetailApi.productNumber : this.certselected.product.productNumber;
  }

  private validateAcctTypeCardSelectedInfo(): string {
    return !!this.certselected.product.productDetailApi ?
    this.certselected.product.productDetailApi.productBankType : this.certselected.product.productTypeBDB;
  }
}
