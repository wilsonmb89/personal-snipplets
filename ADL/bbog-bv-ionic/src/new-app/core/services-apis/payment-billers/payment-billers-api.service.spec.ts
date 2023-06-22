import {TestBed} from '@angular/core/testing';
import {buildMockResponse, expectObject, mockHttpClientInfo} from '@app/apis/services-apis.spec';
import {PaymentBillersApiService} from '@app/apis/payment-billers/payment-billers-api.service';
import {
  Account,
  CheckPaymentTaxRq,
  CheckPaymentTaxRs,
  InvoiceInfoDetail,
  PmtCodServ, TaxPayRq, PaymentRs
} from '@app/apis/payment-billers/models/payment-billers-api.model';

let paymentBillersApiService: PaymentBillersApiService;


describe('ValidationApiService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(
      {providers: [PaymentBillersApiService, mockHttpClientInfo]})
      .compileComponents();
    paymentBillersApiService = TestBed.get(PaymentBillersApiService);
  });

  it('should post request CheckPaymentTax', (done) => {

    const invoiceInfoDetail: InvoiceInfoDetail = {
      desc: 'Dian',
      invoiceNum: '1234567',
      totalCurAmt: '1400000',
      feeAmt: '23000',
      pmtPeriod: '2019',
      taxType: 'tributary',
      invoiceType: 'tributary',
      paidCurAmt: 'COP',
      expDt: '01/12/2020 11:31 AM',
      dueDt: '01/12/2020 11:31 AM',
      billStatus: '',
      identSerialNum: '',
      govIssueIdentType: '',

    };

    const mock: CheckPaymentTaxRs = {
      invoiceInfoDetails: new Array<InvoiceInfoDetail>(invoiceInfoDetail)
    };

    buildMockResponse(mock);

    const checkPaymentTaxRq: CheckPaymentTaxRq = {
      pmtCodServ: 'Tributary',
      govIssueIdentType: '',
      identSerialNum: '',
      invoiceNum: '12345678'
    };

    const result = paymentBillersApiService.checkPaymentTax(checkPaymentTaxRq);
    expectObject(result, mock, done);
  });

  it('should post request TaxPay', (done) => {
    const mock: PaymentRs = {
      message: 'OK',
      approvalId: '12345678',
      requestId: '1234567'
    };

    buildMockResponse(mock);

    const account = new Account();
    account.accountType = 'SDA',
    account.accountNumber = '123456789';

    const taxPayRq: TaxPayRq = {
      account: this.account,
      invoiceType: 'tributary',
      invoiceNum: '1234567',
      govIssueIdentType: 'CC',
      identSerialNum: '12345678',
      totalCurAmt: '11111',
      feeAmt: '111111',
      expDt: '01/12/2020 11:31 AM',
      taxInfoAmt: '',
      taxType: 'tributary',
      taxTypeInvoice: 'tributary',
      pmtPeriod: ''
    };

    const result = paymentBillersApiService.taxPay(taxPayRq);
    expectObject(result, mock, done);
  });

});


