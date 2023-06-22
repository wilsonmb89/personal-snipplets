import { TestBed } from '@angular/core/testing';
import { ProductsService } from '@app/apis/products/products/products.service';
import { of } from 'rxjs/observable/of';
import { LoyaltyDelegateService } from './loyalty-delegate.service';

let loyaltyDelegateService: LoyaltyDelegateService;

describe('LoyaltyDelegateService', () => {
  const productsServiceMock = jasmine.createSpyObj('ProductsService', [
    'getLoyaltyProgram',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoyaltyDelegateService,
        { provide: ProductsService, useValue: productsServiceMock },
      ],
    }).compileComponents();
    loyaltyDelegateService = TestBed.get(LoyaltyDelegateService);

    it('getLoyaltyBalance inquiry should return data mapped', (done) => {
      const mockResponse = {
        balance: '405',
        partners: [
          {
            name: 'Banco AV Villas',
            balance: '100',
            status: 'Activo',
            memberSince: '2020-12-07T00:00:00',
            rank: '',
            description: 'Estado Miembro Socio',
            bankId: '052',
          },
          {
            name: 'Banco Popular',
            balance: '100',
            status: 'Activo',
            memberSince: '2020-12-07T00:00:00',
            rank: '',
            description: 'Estado Miembro Socio',
            bankId: '002',
          },
          {
            name: 'Banco de Occidente',
            balance: '100',
            status: 'Activo',
            memberSince: '2020-12-07T00:00:00',
            rank: '',
            description: 'Estado Miembro Socio',
            bankId: '023',
          },
          {
            name: 'Banco de Bogota',
            balance: '105',
            status: 'Activo',
            memberSince: '2020-12-07T00:00:00',
            rank: '',
            description: 'Estado Miembro Socio',
            bankId: '001',
          },
        ],
      };

      productsServiceMock.getLoyaltyProgram.and.returnValue(of(mockResponse));

      const serviceResult = loyaltyDelegateService.getLoyaltyBalance();
      expect(serviceResult).toBeTruthy();

      serviceResult.subscribe(
        res => {
          expect(res.balance).toEqual(mockResponse.balance);
          expect(res.partners.length).toEqual(mockResponse.partners.length);
          expect(res.partners[0].name).toEqual(mockResponse.partners[0].name);
          expect(res.partners[0].balance).toEqual(mockResponse.partners[0].balance);
          expect(res.partners[0].memberSince).toEqual(mockResponse.partners[0].memberSince);
          expect(res.partners[0].rank).toEqual(mockResponse.partners[0].rank);
          expect(res.partners[0].description).toEqual(mockResponse.partners[0].description);
          done();
        }
      );
    });
  });
});
