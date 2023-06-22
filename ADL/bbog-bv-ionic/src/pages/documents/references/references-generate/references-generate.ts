import { Component, ComponentFactoryResolver, OnInit, ViewContainerRef } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Events } from 'ionic-angular';
import { map, switchMap, take } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BdbItemCardModel } from '../../../../components/bdb-item-card-v2/bdb-item-card-v2';
import { BankReferenceProvider } from '../../../../providers/bank-reference/bank-reference';
import { RenameBdbPdfProvider } from '../../../../providers/rename-bdb-pdf/rename-bdb-pdf';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { AccountReference, BankReferenceRq, CustomerReference } from '../../../../app/models/bank-reference/bank-reference-rq';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { BdbMaskProvider, MaskType } from '../../../../providers/bdb-mask';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import {
  ServiceApiErrorModalService
} from '@app/shared/components/modals/service-api-error-modal/provider/service-api-error-modal.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';


@IonicPage()
@Component({
  selector: 'page-references-generate',
  templateUrl: 'references-generate.html',
})
export class ReferencesGeneratePage implements OnInit {

  item: BdbItemCardModel;
  formCertificateInfo: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemoryProvider: BdbInMemoryProvider,
    private bdbMaskProvider: BdbMaskProvider,
    private fb: FormBuilder,
    private bankReferenceProvider: BankReferenceProvider,
    private renameBdbPdfProvider: RenameBdbPdfProvider,
    private loading: LoadingController,
    private events: Events,
    private userFacade: UserFacade,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private serviceApiErrorModalService: ServiceApiErrorModalService,
  ) {
    const productDetail: ProductDetail = bdbInMemoryProvider.getItemByKey(InMemoryKeys.AcctBankReference);
    if (!!productDetail) {
      this.item = this.mapToCard(productDetail);
    }
    this.events.publish('srink', true);
  }

  ngOnInit() {
    this.formCertificateInfo = this.fb.group({
      receiver: ['', Validators.required],
      includedAmt: [true]
    });
  }

  mapToCard(e: ProductDetail) {
    return {
      title: e.productName,
      desc: [
        `No. ${e.productNumber}`,
        `Saldo: ${this.bdbMaskProvider.maskFormatFactory(e.amount, MaskType.CURRENCY)}`
      ],
      showLogo: true,
      logoPath: BdbConstants.BBOG_LOGO_WHITE,
      account: e
    };
  }

  generateReference() {
    if (this.formCertificateInfo.valid) {
      const loading = this.loading.create();

      this.userFacade.basicData$.pipe(
        take(1),
        map(userInfo => {
          const productDetail: ProductDetail = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.AcctBankReference);
          const customerReference: CustomerReference = {
            fullName: !!userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'N/A',
            email: !!userInfo && !!userInfo.emailAddr ? userInfo.emailAddr : 'N/A'
          };

          return {
            accountReference: [this.mapAccountReference(productDetail)],
            receiver: this.formCertificateInfo.get('receiver').value,
            customerReference: customerReference
          };
        }),
        switchMap((bankReferenceInfo: BankReferenceRq) => {
          loading.present();
          return this.bankReferenceProvider.getBankReference(bankReferenceInfo);
        })
      ).subscribe((data) => {
        loading.dismiss();
        this.renameBdbPdfProvider.createPdf(
          {
            binData: data.binData,
            statusDesc: '',
            binLength: ''
          },
          null,
          data.fileName,
          ''
        ).subscribe(() => { }, () => { });

      }, (ex) => {
        loading.dismiss();
        const errorData: ApiGatewayError = ex.error ? ex.error : null;
        this.serviceApiErrorModalService.launchErrorModal(
          this.viewRef,
          this.resolver,
          !!errorData ? errorData.customerErrorMessage : null
        );
      });
    }
  }

  private mapAccountReference(account: ProductDetail): AccountReference {
    return {
      acctType: account.productTypeBDB,
      acctId: account.category === BdbConstants.TARJETA_CREDITO_BBOG ?
        account.productNumberApi : account.productNumber,
      amount: +account.amount,
      openDt: account.openDt,
      includedAmt: this.formCertificateInfo.get('includedAmt').value
    };
  }

}
