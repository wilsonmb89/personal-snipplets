import { TestBed } from '@angular/core/testing';
import { buildMockResponse, expectObject, mockHttpClientInfo, } from '@app/apis/services-apis.spec';
import { LoyaltyProgramRs } from './models/LoyaltyProgramRs';
import { ApiProductDetail, EnrollCustomCardRq, GenericResponse, GetAllProductsRs } from './models/products';
import { ProductsService } from './products.service';
import { GetCardsRq, GetCardsRs } from './models/getCards.dto';

let productApiService: ProductsService;

describe('ProductsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsService, mockHttpClientInfo],
    }).compileComponents();
    productApiService = TestBed.get(ProductsService);
  });

  it('should post request GetAllProducts', (done) => {
    const productListMock: ApiProductDetail[] = [
      {
        productName: 'Cuenta de Ahorros LibreAhorro',
        description: 'AH Cuota Administración',
        officeId: '0180',
        productAthType: 'ST',
        productBankType: 'SDA',
        productBankSubType: '061AH',
        productNumber: '0180577926',
        valid: true,
        franchise: '',
        openDate: '2019-10-10',
        status: 'A'
      },
      {
        productName: 'Cuenta de Ahorros Nómina',
        description: 'AH Cuentas Privadas',
        officeId: '0041',
        productAthType: 'ST',
        productBankType: 'SDA',
        productBankSubType: '010AH',
        productNumber: '0041481896',
        valid: true,
        franchise: '',
        openDate: '2020-07-30',
        status: 'A'
      }
    ];
    const getAllProductsMock: GetAllProductsRs = {
      accountList: [...productListMock],
    };

    buildMockResponse(getAllProductsMock);

    const result = productApiService.getAll();
    expectObject(result, getAllProductsMock, done);
  });

  it('should post request LoyaltyProgram', (done) => {
    const loyaltyProgramMock: LoyaltyProgramRs = {
      balance: '100000',
      partners: [
        {
          name: 'loyalty_1',
          balance: '50',
          status: 'OK',
          memberSince: '01-01-2001',
          rank: '1',
          description: 'Mock test',
        },
        {
          name: 'loyalty_2',
          balance: '40',
          status: 'OK',
          memberSince: '02-02-2001',
          rank: '2',
          description: 'Mock test',
        },
      ],
    };

    buildMockResponse(loyaltyProgramMock);

    const result = productApiService.getLoyaltyProgram();
    expectObject(result, loyaltyProgramMock, done);
  });


  it('hould post request EnrollCustomCard', (done) => {
    const request: EnrollCustomCardRq = {
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

    const responseMock: GenericResponse = {
      requestId: '123456789',
      approvalId: '0987654321',
      message: 'Enroll unicef rs mock test'
    };

    buildMockResponse(responseMock);

    const result = productApiService.enrollCustomCard(request);

    expectObject(result, responseMock, done);

  });


  it('should post request GetCards', (done) => {
    const getCardsRqMock = new GetCardsRq(
      '12345',
      'SDA',
      '1',
      ['01']
    );

    const getCardsRsMock: GetCardsRs = {
      accountList: [
        {
          bankId: '001',
          productBankType: 'SDA',
          productNumber: '12345',
          status: '1'
        }
      ]
    };

    buildMockResponse(getCardsRsMock);

    const result = productApiService.getCards(getCardsRqMock);
    expectObject(result, getCardsRsMock, done);
  });
});
