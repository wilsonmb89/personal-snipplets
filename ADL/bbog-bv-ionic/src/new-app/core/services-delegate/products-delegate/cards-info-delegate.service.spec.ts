import { TestBed } from '@angular/core/testing';
import { GetCardsRs } from '@app/apis/products/products/models/getCards.dto';
import { ProductsService } from '@app/apis/products/products/products.service';
import { of } from 'rxjs/observable/of';
import { CardsInfoDelegateService } from './cards-info-delegate.service';

let cardsInfoDelegateService: CardsInfoDelegateService;

describe('CardsInfoDelegateService', () => {
  const productsServiceMock = jasmine.createSpyObj('ProductsService', [
    'getCards',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CardsInfoDelegateService,
        { provide: ProductsService, useValue: productsServiceMock },
      ],
    }).compileComponents();
    cardsInfoDelegateService = TestBed.get(CardsInfoDelegateService);
  });

  it('getCardsMappedCustomerCard inquiry should return data mapped', (done) => {
    const mockResponse: GetCardsRs = {
      accountList: [
        {
          bankId: '001',
          productBankType: 'CRE',
          productNumber: '5120690928733502',
          status: 'E',
        },
        {
          bankId: '001',
          productBankType: 'PRIV',
          productNumber: '7777670002006699',
          status: 'N',
        },
        {
          bankId: '001',
          productBankType: 'DEB',
          productNumber: '4576020000061915',
          status: 'N',
        }
      ]
    };

    const mockResponseLength = mockResponse.accountList.length;

    productsServiceMock.getCards.and.returnValue(of(mockResponse));

    const serviceResult = cardsInfoDelegateService.getCardsMappedCustomerCard('', '' , '1', ['ALL']);
    expect(serviceResult).toBeTruthy();

    serviceResult.subscribe(
      res => {
        expect(res.length).toEqual(mockResponseLength);
        expect(res[0].cardNumber).toEqual(mockResponse.accountList[0].productNumber);
        expect(res[0].cardState).toEqual(mockResponse.accountList[0].status);
        expect(res[0].cardType).toEqual(mockResponse.accountList[0].productBankType);
        done();
      }
    );
  });
});
