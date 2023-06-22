import { TestBed } from '@angular/core/testing';
import { ProductsService } from '@app/apis/products/products/products.service';
import { of } from 'rxjs/observable/of';
import { EnrollCustomCardDelegateService } from './enroll-custom-card-delegate.service';
import { EnrollCustomCardRq, GenericResponse } from '@app/apis/products/products/models/products';

let enrollCustomCardDelegateService: EnrollCustomCardDelegateService;

describe('EnrollCustomCardDelegateService', () => {

  const productsServiceMock = jasmine.createSpyObj('ProductsService', ['enrollCustomCard']);


  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        providers: [EnrollCustomCardDelegateService, {
          provide: ProductsService,
          useValue: productsServiceMock
        }]
      }
    ).compileComponents();
    enrollCustomCardDelegateService = TestBed.get(EnrollCustomCardDelegateService);

  });


  it('EnrollCustomCardDelegateService should return service data', (done) => {

    const mock: GenericResponse = {
      approvalId: '',
      message: '',
      requestId: ''
    };

    const rq: EnrollCustomCardRq = {
      customCardSpecification: 'GREEN_CARD',
      customerAddressDistrict: '',
      accountOfficeId: '',
      customerAccountNumber: '',
      customerAlternativePhoneNumber: '',
      customerCellPhone: '',
      customerAccountSubtype: '',
      customerAddressNumber: '',
      customerPhoneNumber: '',
      customerZipCode: ''
    };

    productsServiceMock.enrollCustomCard.and.returnValue(of(mock));

    const result = enrollCustomCardDelegateService.enrollCustomCard(rq);

    expect(result).toBeTruthy();

    result.subscribe((data) => {
      expect(data).toEqual(mock);
      done();
    });

  });

});
