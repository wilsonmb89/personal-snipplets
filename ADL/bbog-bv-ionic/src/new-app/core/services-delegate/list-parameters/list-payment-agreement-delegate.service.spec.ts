import { ListPaymentAgreementDelegate } from './list-payment-agreement-delegate.service';
import { TestBed } from '@angular/core/testing';
import { PaymentCoreApiService } from '@app/apis/payment-core/payment-core-api.service';
import { of } from 'rxjs/observable/of';
import { PaymentAgreementRs } from '@app/apis/payment-core/models/payment-agreement.model';

let listPaymentAgreementDelegate: ListPaymentAgreementDelegate;

describe('ListPaymentAgreementDelegate', () => {

  const paymentCoreApiServiceMock = jasmine.createSpyObj('PaymentCoreApiService', ['getPaymentAgreement']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListPaymentAgreementDelegate,
        {
          provide: PaymentCoreApiService,
          useValue: paymentCoreApiServiceMock
        }
      ]
    }).compileComponents();

    listPaymentAgreementDelegate =  TestBed.get(ListPaymentAgreementDelegate);
  });

  it('getAgreements should get empty array when request length is less than 3', (done) => {
    listPaymentAgreementDelegate.getAgreements('x').subscribe((data) => {
      expect(data).toEqual([]);
      done();
    });
  });

  it('getAgreements should get array when request length is more than 3', (done) => {

    const mock: PaymentAgreementRs = {
      inquiriesAgreementDtos: [
        {
          category: 'x',
          code: 'x',
          name: 'x',
          urlImage: 'x'
        }
      ]
    };

    paymentCoreApiServiceMock.getPaymentAgreement.and.returnValue(of(mock));

    listPaymentAgreementDelegate.getAgreements('xxxx').subscribe((data) => {
      expect(data).toEqual(mock.inquiriesAgreementDtos);
      done();
    });


  });

});
