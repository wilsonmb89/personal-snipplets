import {TestBed} from '@angular/core/testing';
import {PaymentNonBillersApiService} from '@app/apis/payment-nonbillers/payment-nonbillers-api.service';
import {DonationRq, DonationRs} from '@app/apis/payment-nonbillers/models/donations.model';
import {buildMockResponse, expectObject, mockHttpClientInfo} from '@app/apis/services-apis.spec';


let paymentNonBillersApiService: PaymentNonBillersApiService;


describe('PaymentNonBillersApiService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(
    {providers: [PaymentNonBillersApiService, mockHttpClientInfo]})
    .compileComponents();
    paymentNonBillersApiService = TestBed.get(PaymentNonBillersApiService);
  });

  it('should post request', ( done) => {
    const mock: DonationRs = {
      message: 'OK',
      approvalId: '111111',
      requestId: '11111222'
    };
   buildMockResponse(mock);

    const donationRq: DonationRq = {
      amount: 5000,
      enterpriseId: 'enterpriseId',
      acctId: '123456789',
      acctType: 'SDA'
    };

    const result = paymentNonBillersApiService.applyDonation(donationRq);
    expectObject(result, mock, done);
  });

});


