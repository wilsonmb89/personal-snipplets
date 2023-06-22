import { PayDianDelegateService } from './pay-dian-delegate.service';
import { PaymentBillersApiService } from '@app/apis/payment-billers/payment-billers-api.service';
import { TestBed } from '@angular/core/testing';
import { PaymentRs } from '@app/apis/payment-billers/models/payment-billers-api.model';
import { of } from 'rxjs/observable/of';
import { DianTaxInfo } from '@app/modules/payments/models/taxes-info';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';


let payDianDelegateService: PayDianDelegateService;


describe('PayDianDelegateService', () => {

  const paymentBillersApiServiceMock = jasmine.createSpyObj('PaymentBillersApiService', ['taxPay']);

  const bdbUtilsProviderMock = jasmine.createSpyObj('BdbUtilsProvider', ['mapTypeProduct']);

  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        providers: [PayDianDelegateService,
          {
            provide: PaymentBillersApiService,
            useValue: paymentBillersApiServiceMock
          },
          {
            provide: BdbUtilsProvider,
            useValue: bdbUtilsProviderMock
          }
        ]
      }
    ).compileComponents();

    payDianDelegateService = TestBed.get(PayDianDelegateService);


  });

  it('payDianDelegateService should return data of the service', (done) => {

    const mock: PaymentRs = {
      approvalId: '',
      message: '',
      requestId: ''

    };

    paymentBillersApiServiceMock.taxPay.and.returnValue(of(mock));

    bdbUtilsProviderMock.mapTypeProduct.and.returnValue(of(''));

    const productDetail = new ProductDetail();
    productDetail.productNumberApi = '';
    productDetail.productType = 'SDA';

    const request: DianTaxInfo = {
      taxInfo: {
        taxCode: '',
        invoiceNum: '',
        taxName: ''
      },
      accountOrigin: productDetail,
      taxInfoDetail: {
        totalCurAmt: '',
        taxType: '',
        pmtPeriod: '',
        paidCurAmt: '',
        invoiceType: '',
        invoiceNum: '',
        identSerialNum: '',
        govIssueIdentType: '',
        feeAmt: '',
        expDt: '',
        dueDt: '',
        desc: '',
        billStatus: ''
      }
    };

    const result = payDianDelegateService.taxPay(request);
    expect(result).toBeTruthy();

    result.subscribe(r => {
      expect(r).toEqual(mock);
      done();
    });


  });


});
