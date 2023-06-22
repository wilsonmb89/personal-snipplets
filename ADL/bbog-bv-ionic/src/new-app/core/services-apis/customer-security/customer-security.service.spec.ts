import {TestBed} from '@angular/core/testing';
import {buildMockResponse, expectObject, mockHttpClientInfo} from '@app/apis/services-apis.spec';
import {CustomerSecurityService} from '@app/apis/customer-security/customer-security.service';
import {DebitCardActivationRq, DebitCardActivationRs} from '@app/apis/customer-security/models/debitCardActivation.dto';
import {DebitCardLockRq, DebitCardLockRs} from '@app/apis/customer-security/models/debitCardLock.dto';


let customerSecurityService: CustomerSecurityService;


describe('CustomerSecurityService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(
      {providers: [CustomerSecurityService, mockHttpClientInfo]})
      .compileComponents();
    customerSecurityService = TestBed.get(CustomerSecurityService);
  });

  it('should post request DebitCardActivation', (done) => {
    const mock: DebitCardActivationRs = {
      message: 'OK',
      approvalId: '123456',
      requestId: '123456'
    };

    buildMockResponse(mock);

    const debitCardActivationRq: DebitCardActivationRq = {
      acctId: '12345678',
      secretId: 'qwertyusdfg'
    };

    const result = customerSecurityService.debitCardActivation(debitCardActivationRq);
    expectObject(result, mock, done);
  });

  it('should post request DebitCardLock', (done) => {
    const mock: DebitCardLockRs = {
      message: 'OK',
      approvalId: '1234567',
      requestId: '12345678',
    };

    buildMockResponse(mock);

    const debitCardLockRq: DebitCardLockRq = {
      accountId: '123456',
      referenceType: 'SDA123'
    };

    const result = customerSecurityService.debitCardLock(debitCardLockRq);
    expectObject(result, mock, done);
  });

});


