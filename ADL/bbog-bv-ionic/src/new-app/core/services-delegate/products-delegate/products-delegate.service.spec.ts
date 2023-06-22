import { TestBed } from '@angular/core/testing';
import { ProductsDetailService } from '@app/apis/products/products-detail/products-detail.service';
import { ProductsService } from '@app/apis/products/products/products.service';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { ProductsDelegateService } from './products-delegate.service';
import { ProductsFacade } from '../../../shared/store/products/facades/products.facade';
import { GetAllProductsRs } from '@app/apis/products/products/models/products';
import { of } from 'rxjs/observable/of';
import { BdbRsaProvider } from '../../../../providers/bdb-rsa/bdb-rsa';

let productsDelegateService: ProductsDelegateService;

describe('ProductsDelegateService', () => {
  const productsServiceMock = jasmine.createSpyObj('ProductsService', [
    'getAll',
  ]);

  const productsDetailServiceMock = jasmine.createSpyObj(
    'ProductsDetailService',
    ['getBalance', 'getCdtCustomer']
  );

  const bdbStorageServiceMock = jasmine.createSpyObj('BdbStorageService', [
    'getItemByKey',
    'setItemByKey',
  ]);

  const productsFacadeMock = jasmine.createSpyObj('ProductsFacade', [
    'setDigitalCDTBalances',
    'setProducts',
  ]);

  const bdbRsaProviderMock = jasmine.createSpyObj('BdbRsaProvider', [
    'encrypt'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsDelegateService,
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: ProductsDetailService, useValue: productsDetailServiceMock },
        { provide: BdbStorageService, useValue: bdbStorageServiceMock },
        { provide: ProductsFacade, useValue: productsFacadeMock },
        { provide: BdbRsaProvider, useValue: bdbRsaProviderMock },
      ],
    }).compileComponents();
    productsDelegateService = TestBed.get(ProductsDelegateService);
  });

  it('getProducts inquiry should return data mapped', (done) => {
    const mockResponse: GetAllProductsRs = {
      accountList: [
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
        },
        {
          productName: 'Cuenta de Ahorros',
          description: 'Unicef',
          officeId: '0041',
          productAthType: 'ST',
          productBankType: 'SDA',
          productBankSubType: '099AH',
          productNumber: '0041481888',
          valid: true,
          franchise: '',
          openDate: '2020-07-30',
          status: 'A'
        },
      ],
    };

    productsServiceMock.getAll.and.returnValue(of(mockResponse));

    const serviceResult = productsDelegateService.getProducts();
    expect(serviceResult).toBeTruthy();

    serviceResult.subscribe((res) => {
      expect(res.length).toEqual(mockResponse.accountList.length);
      expect(res[0].productType).toEqual(
        mockResponse.accountList[0].productAthType
      );
      expect(res[0].productDetailApi.description).toEqual(
        mockResponse.accountList[0].description
      );
      expect(res[0].productDetailApi.valid).toEqual(mockResponse.accountList[0].valid);
      expect(res[0].productDetailApi.officeId).toEqual(mockResponse.accountList[0].officeId);
      done();
    });
  });
});
