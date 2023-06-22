import { TestBed } from '@angular/core/testing';
import { buildMockResponse, expectObject, mockHttpClientInfo } from '@app/apis/services-apis.spec';
import { PaymentCoreApiService } from '@app/apis/payment-core/payment-core-api.service';
import { BillerInfoList, GetBillersPaymentRs } from '@app/apis/payment-core/models/billers-payment.model';
import { InquiriesAgreementDto, PaymentAgreementRq, PaymentAgreementRs } from './models/payment-agreement.model';

let paymentCoreApiService: PaymentCoreApiService;


describe('PaymentCoreApiService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(
      {providers: [PaymentCoreApiService, mockHttpClientInfo]})
      .compileComponents();
    paymentCoreApiService = TestBed.get(PaymentCoreApiService);
  });

  it('should post request GetBillersPayment', (done) => {

    const billerInfoList: BillerInfoList = {
      invoiceNum: '1234567',
      nie: '3245677',
      nickname: 'Codensa Casa',
      contraction: 'CC',
      orgIdNum: '23456',
      orgInfoName: 'ALBERTO ALVAREZ',
      agrmType: '0',
      pmtType: '0',
      maxAmount: '0',
      invoiceVouchNum: '219007442841',
      hasInvoice: false,
      scheduled: false,
      amt: '0',
      dueDt: '2021-10-04T00:00:00-05:00',
      expDt: '2021-10-04T00:00:00-05:00',
      accountNumber: '12345678',
      accountType: 'SDA',
      toPayBeforeExpDaysThreshold: '0',
      invGen: false

    };

    const mock: GetBillersPaymentRs = {
      billerInfoList: new Array<BillerInfoList>(billerInfoList)
    };

    buildMockResponse(mock);

    const result = paymentCoreApiService.getBillersPayment();
    expectObject(result, mock, done);
  });

  it('should post request getPaymentAgreement', (done) => {

    const inquiriesAgreementDtos: InquiriesAgreementDto = {
      code: '00001774',
      name: 'ACCION INMOBILIARIA COM SAS',
      urlImage: 'xxxx'
    };

    const mock: PaymentAgreementRs = {
      inquiriesAgreementDtos: new Array<InquiriesAgreementDto>(inquiriesAgreementDtos)
    };

    buildMockResponse(mock);

    const paymentAgreementRq: PaymentAgreementRq = {
      name: 'Accion'
    };

    const result = paymentCoreApiService.getPaymentAgreement(paymentAgreementRq);
    expectObject(result, mock, done);
  });

});


