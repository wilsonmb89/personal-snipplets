import { CustomerSecurityService } from '@app/apis/customer-security/customer-security.service';
import { TestBed } from '@angular/core/testing';
import { DebitCardLockDelegateService } from './debit-card-lock-delegate.service';
import { DebitCardLockRs } from '@app/apis/customer-security/models/debitCardLock.dto';
import { of } from 'rxjs/observable/of';

let debitCardLockDelegateService: DebitCardLockDelegateService;

describe('DebitCardLockDelegateService', () => {

  const customerSecurityServiceMock = jasmine.createSpyObj('CustomerSecurityService', ['debitCardLock']);

  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        providers: [DebitCardLockDelegateService,
          {
            provide: CustomerSecurityService,
            useValue: customerSecurityServiceMock
          }]
      }
    ).compileComponents();

    debitCardLockDelegateService = TestBed.get(DebitCardLockDelegateService);

  });


  it('DebitCardActivation should return data of the service', (done) => {

    const mock: DebitCardLockRs = {
      approvalId: 'x',
      message: 'x',
      requestId: 'x'
    };

    customerSecurityServiceMock.debitCardLock.and.returnValue(of(mock));

    const result = debitCardLockDelegateService.debitCardLock('x', 'x');

    expect(result).toBeTruthy();

    result.subscribe(r => {
      expect(r).toEqual(mock);
      done();
    });

  });

});


