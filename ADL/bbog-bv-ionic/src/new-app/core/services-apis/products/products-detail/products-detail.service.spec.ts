import { TestBed } from '@angular/core/testing';
import { ProductsDetailService } from './products-detail.service';
import {
  buildMockResponse,
  expectObject,
  mockHttpClientInfo,
} from '@app/apis/services-apis.spec';
import { GetBalanceRq } from './models/GetBalanceRq';
import { GetBalanceRs } from './models/GetBalanceRs';
import { GetTransactionHistoryRq } from './models/GetTransactionHistoryRq';
import { GetTransactionHistoryRs } from './models/GetTransactionHistoryRs';

let productsDetailService: ProductsDetailService;

describe('ProductsDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsDetailService, mockHttpClientInfo],
    }).compileComponents();
    productsDetailService = TestBed.get(ProductsDetailService);
  });

  it('should post request GetBalance', (done) => {

    const getBalanceRqMock: GetBalanceRq = {
      productsInfo: [
        {
          acctId: '1235',
          acctType: 'SDA',
          acctSubType: '001',
          officeId: '0012',
          refId: '1234',
          refType: '1111'
        }
      ]
    };

    const getBalanceRsMock: GetBalanceRs = {
      productBalanceInfoList: [
        {
          accountId: '0041481896',
          accountType: 'SDA',
          balanceDetail: '',
          expDate: '2019-10-10',
          status: ''
        }
      ]
    };

    buildMockResponse(getBalanceRsMock);

    const result = productsDetailService.getBalance(getBalanceRqMock, 'loans');
    expectObject(result, getBalanceRsMock, done);
  });

  it('should post request GetCdtCustomer', (done) => {

    const getCdtCustomerRsMock: GetBalanceRs = {
      productBalanceInfoList: [
        {
          accountId: '0041481896',
          accountType: 'SDA',
          balanceDetail: '',
          expDate: '2019-10-10',
          status: ''
        }
      ]
    };

    buildMockResponse(getCdtCustomerRsMock);

    const result = productsDetailService.getCdtCustomer();
    expectObject(result, getCdtCustomerRsMock, done);
  });

  it('should post request GetTransactionHistory', (done) => {

    const getTransactionHistoryRqMock: GetTransactionHistoryRq = {
      acctId: '0041481896',
      acctType: 'SDA',
      startDt: '2019-10-10',
      endDt: '01-12-2001'
    };

    const getTransactionHistoryRsMock: GetTransactionHistoryRs = {
      finalTransactionList: [
        {
          description: 'AH Cuota Administración',
          amount: '1233123',
          date: '2019-10-10',
          instalments: '111111'
        }
      ]
    };

    buildMockResponse(getTransactionHistoryRsMock);

    const result = productsDetailService.getTransactionHistory(getTransactionHistoryRqMock);
    expectObject(result, getTransactionHistoryRsMock, done);
  });
});
