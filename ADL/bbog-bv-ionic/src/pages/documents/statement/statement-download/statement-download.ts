import { Component, ComponentFactoryResolver, OnInit, ViewContainerRef } from '@angular/core';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { ProductExtractsRq } from '../../../../app/models/extracts/product-extracts-request';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { BdbItemCardModel } from '../../../../components/bdb-item-card-v2/bdb-item-card-v2';
import { BdbPdfProvider } from '../../../../providers/bdb-pdf/bdb-pdf';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { Events } from 'ionic-angular';
import { ProductExtractsRs } from '../../../../app/models/extracts/product-extracts-response';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountStatementDelegateService } from '@app/delegate/documents/account-statement-delegate.service';
import { ListRangeDto } from '@app/apis/banking-reports/models/statement-period.model';
import {
  ServiceApiErrorModalService
} from '@app/shared/components/modals/service-api-error-modal/provider/service-api-error-modal.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';

@PageTrack({ title: 'statement-download' })
@IonicPage()
@Component({
  selector: 'page-statement-download',
  templateUrl: 'statement-download.html',
})
export class StatementDownloadPage implements OnInit {
  product: any;
  headItem: BdbItemCardModel;
  extractRq = new ProductExtractsRq();
  rawAcct: ProductDetail;
  dateList: Array<{ year: string, period: Array<{ name: string, value: string, selected: boolean }> }> = [];
  elevation = 4;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingController: LoadingController,
    private loadingCtrl: LoadingController,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbUtils: BdbUtilsProvider,
    private bdbPdf: BdbPdfProvider,
    private events: Events,
    private accountStatementDelegateService: AccountStatementDelegateService,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private serviceApiErrorModalService: ServiceApiErrorModalService,
  ) { }

  ngOnInit(): void {
    this.events.publish('srink', true);
  }

  ionViewDidLoad() {
    this.product = this.bdbInMemory.getItemByKey(InMemoryKeys.ProductDetail);
    const logoPath = this.product.category === BdbConstants.TARJETA_CREDITO_BBOG
      ? this.bdbUtils.getImageUrl(this.product.productType)
      : BdbConstants.BBOG_LOGO_WHITE;
    this.headItem = {
      title: this.product.productName,
      desc: [`No. ${this.product.productNumber}`,
      `${this.product.productBank}`],
      logoPath,
      showLogo: true
    };
    this.getRangeDate(this.product);
  }

  getRangeDate(product: ProductDetail) {
    this.rawAcct = product;
    this.extractRq.acctId = product.productNumberApi;
    this.extractRq.acctType = this.bdbUtils.mapTypeProduct(product.productType);

    const loading = this.loadingCtrl.create();
    loading.present().then(() => {

      this.accountStatementDelegateService
        .getPeriods(this.extractRq)
        .subscribe(
          (rangeDt: ListRangeDto[]) => {
            if (rangeDt.length > 0) {
              this.buildListDate(rangeDt);
            }
            loading.dismiss();
          },
          (ex) => {
            this.dateList = [];
            loading.dismiss();
            const errorData: ApiGatewayError = ex.error ? ex.error : null;
            this.serviceApiErrorModalService.launchErrorModal(
              this.viewRef,
              this.resolver,
              !!errorData ? errorData.customerErrorMessage : null
            );
          }
        );
    });
  }

  buildListDate(dates: ListRangeDto[]) {
    dates.forEach(d => {
      const year = d.value.substring(0, 4);

      const periodName = {
        name: d.name.replace(` ${year}`, ''),
        value: d.value,
        selected: false
      };

      const tempArray = this.dateList.find(i => i.year === year);
      if (!!tempArray) {
        tempArray.period.push(periodName);
      } else {
        this.dateList.push({
          year,
          period: [periodName]
        });
      }
    });
  }

  clearSelection() {
    this.dateList.forEach(e => {
      e.period.forEach(p => p.selected = false);
    });
  }

  onItemClick(item) {
    this.clearSelection();
    item.selected = true;
    this.extractRq.startDate = item.value;
    const loading = this.loadingController.create();
    loading.present().then(() => {

      this.accountStatementDelegateService
        .getStatement(this.extractRq)
        .subscribe(
          (data: ProductExtractsRs) => {
            loading.dismiss();
            this.bdbPdf
              .createPdf(
                data,
                this.rawAcct,
                this.extractRq.startDate,
                'EXTRACTO_'
              ).subscribe(
                _ => this.clearSelection()
              );
          }, (ex: HttpErrorResponse) => {
            this.clearSelection();
            loading.dismiss();
            const errorData: ApiGatewayError = ex.error ? ex.error : null;
            this.serviceApiErrorModalService.launchErrorModal(
              this.viewRef,
              this.resolver,
              !!errorData ? errorData.customerErrorMessage : null
            );
          }
        );
    });
  }
}
