import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { TransactionHistoryDelegateService } from './transaction-history-delegate.service';
import { ProductsDetailService } from '@app/apis/products/products-detail/products-detail.service';
import { GetTransactionHistoryRq } from '@app/apis/products/products-detail/models/GetTransactionHistoryRq';
import { GetTransactionHistoryRs } from '@app/apis/products/products-detail/models/GetTransactionHistoryRs';

let transactionHistoryDelegateService: TransactionHistoryDelegateService;

describe('TransactionHistoryDelegateService', () => {
  const productsDetailServiceMock = jasmine.createSpyObj('ProductsDetailService', [
    'getTransactionHistory',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionHistoryDelegateService,
        { provide: ProductsDetailService, useValue: productsDetailServiceMock },
      ],
    }).compileComponents();
    transactionHistoryDelegateService = TestBed.get(TransactionHistoryDelegateService);

    it('getTransactionHistory inquiry should return data mapped', (done) => {

      const mockRequest: GetTransactionHistoryRq = {
        acctId: '13212312',
        acctType: 'SDA',
        endDt: '2020-12-01',
        startDt: '2020-01-01'
      };

      const mockResponse: GetTransactionHistoryRs = {
        finalTransactionList: [
          {
            amount: '123455',
            date: '2020-01-01',
            description: 'Pago mock test',
            instalments: ''
          }
        ]
      };

      productsDetailServiceMock.getTransactionHistory.and.returnValue(of(mockResponse));

      const serviceResult = transactionHistoryDelegateService.getTransactionHistory(mockRequest);
      expect(serviceResult).toBeTruthy();

      serviceResult.subscribe(res => {
        expect(res).not.toBeNull();
        done();
      });
    });
  });
});
