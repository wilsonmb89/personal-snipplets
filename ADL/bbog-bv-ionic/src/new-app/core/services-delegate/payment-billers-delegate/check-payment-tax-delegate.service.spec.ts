import { CheckPaymentTaxDelegateService } from './check-payment-tax-delegate.service';
import { TestBed } from '@angular/core/testing';
import { PaymentBillersApiService } from '@app/apis/payment-billers/payment-billers-api.service';
import { CheckPaymentTaxRs } from '@app/apis/payment-billers/models/payment-billers-api.model';
import { of } from 'rxjs/observable/of';
import { DianTaxInfo } from '@app/modules/payments/models/taxes-info';


let checkPaymentTaxDelegateService: CheckPaymentTaxDelegateService;

describe('CheckPaymentTaxDelegateService', () => {

  const paymentBillersApiServiceMock = jasmine.createSpyObj('PaymentBillersApiService', ['checkPaymentTax']);

  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        providers: [CheckPaymentTaxDelegateService, {
          provide: PaymentBillersApiService,
          useValue: paymentBillersApiServiceMock
        }]
      }
    ).compileComponents();

    checkPaymentTaxDelegateService = TestBed.get(CheckPaymentTaxDelegateService);


  });


  it('checkPaymentTax should return data of the service', (done) => {

    const mock: CheckPaymentTaxRs = {
      invoiceInfoDetails: [{
        billStatus: '',
        desc: '',
        dueDt: '',
        expDt: '',
        feeAmt: '',
        govIssueIdentType: '',
        identSerialNum: '',
        invoiceNum: '',
        invoiceType: '',
        paidCurAmt: '',
        pmtPeriod: '',
        taxType: '',
        totalCurAmt: ''
      }]
    };

    paymentBillersApiServiceMock.checkPaymentTax.and.returnValue(of(mock));

    const request: DianTaxInfo = {
      taxInfo: {
        taxCode: '',
        invoiceNum: '',
        taxName: ''
      },
      accountOrigin: null,
      taxInfoDetail: null
    };

    const result = checkPaymentTaxDelegateService.checkPaymentTax(request);
    expect(result).toBeTruthy();

    result.subscribe(r => {
      expect(r).toEqual(mock);
      done();
    });


  });


});
