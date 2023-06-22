import { TestBed } from '@angular/core/testing';
import { CustomerSecurityService } from '@app/apis/customer-security/customer-security.service';
import { DebitCardActivationRs } from '@app/apis/customer-security/models/debitCardActivation.dto';
import { of } from 'rxjs/observable/of';
import { DebitCardActivationDelegateService } from './debit-card-activation-delegate.service';

let debitCardActivationDelegateService: DebitCardActivationDelegateService;

describe('DebitCardActivationDelegateService', () => {

  const customerSecurityServiceMock = jasmine.createSpyObj('CustomerSecurityService', ['debitCardActivation']);

  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        providers: [DebitCardActivationDelegateService, {
          provide: CustomerSecurityService,
          useValue: customerSecurityServiceMock
        }]
      })
      .compileComponents();
    debitCardActivationDelegateService = TestBed.get(DebitCardActivationDelegateService);
  });


  it('DebitCardActivation should return data of the service', (done) => {

    const mock: DebitCardActivationRs = {
      approvalId: 'x',
      message: 'x',
      requestId: 'x'
    };

    customerSecurityServiceMock.debitCardActivation.and.returnValue(of(mock));

    const result = debitCardActivationDelegateService.debitCardActivation('x', 'x');
    expect(result).toBeTruthy();

    result.subscribe(r => {
      expect(r).toEqual(mock);
      done();
    });
  });
});
