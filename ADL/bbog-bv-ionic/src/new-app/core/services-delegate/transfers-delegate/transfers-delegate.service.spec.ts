import { TestBed } from '@angular/core/testing';
import { DoTransferRs } from '@app/apis/transfer-account/models/doTrasfer.model';
import { TransferAccountService } from '@app/apis/transfer-account/transfer-account.service';
import { TransferInfo } from '../../../../app/models/transfers/transfer-info';
import { of } from 'rxjs/observable/of';
import { TransfersDelegateService } from './transfers-delegate.service';
import { TrustAgreementInfo } from 'app/models/trust-agreement/trust-agreement-info';

let transfersDelegateService: TransfersDelegateService;
const trustAgreementInfoMockData = {
  agreement: {
    productBank: 'Banco de Bogota',
    bankId:
      'GmA/c97j5doJ8eZTSyNQBerlh9bGR6HH6yTP0ebk6+UQzmGSJtEi5peqBu0Y75DnXRVGxHbgK8Fn5PYMXdyqpmFZix405fspUP+JLyvQ0RHr8pEMvVXN4NWLl8kk5IIIOhm1UynRLfr2Z48cPcfB55nxJyncWfUbP86AC7LOxgG46Mx52erY7n6mtJnKE+cnT/BoUODeZwUEZZdRWl5zne7NyoAzH2+UrhGq6ByHzrqO4QprYIgc3c+22iKTOQr80HtKihELgRx9VTqque84T1LFwLvVrtJUs5ZKLoPwWVlEOhGt39FNOZdw8ekVz1i1uyd82tlAx2B6TYNPjzOdvQ==',
    isAval: true,
    isActive: true,
    productName: 'FIC Sumar',
    productType: 'FB',
    productNumber: '060001000216278',
    category: 'FD',
    description: 'Saldo total',
    amount: '252588.45',
    productNumberX:
      'N2p1fty5UPY09Ep8hdkfLmWp2isEV3r3l2ng6r3gbJ0Iz4cvwyZiwskjiX9LGztNqXYNML802jC+OSc762pxLLnlcbRbD9w/CBhjlmCO6MqgPLHkf73p04KcEmlHbA7Dav6LHNLA89gaGG6EcNjsiOuYfg3zKOI2SVPVmrdS9Nz8bjnpuuQBjEVAfHXR2OgcFYq4w9gijPUeL24YRSn/SJ1r6QdPQti44NoOMJckCtG7pZpGD4+ArAFO6db+OUIIWb0haKvvM0Ft2nXMWK+B+JTQkw2ZkRoM/PxFYQBrtxMSPh6/vvw4w/19Giw7EUOoHT55SITYGuJmsY7ZtWUfUA==',
    favorite: false,
    favoriteTime: 1607546224018,
    valid: true,
    franchise: null,
    productNumberApi: '001000216278',
    openDt: '2020-04-07',
    productTypeBDB: 'FDA',
    productDetailApi: {
      productName: 'Fiducia',
      description: 'Sumar - FiduBogotá',
      officeId: '2000',
      productAthType: 'FB',
      productBankType: 'FDA',
      productBankSubType: '060FB',
      productNumber: '001000216278',
      valid: true,
      franchise: '',
      openDate: '2020-04-07',
      status: 'A'
    },
    balanceDetail: {
      totalBBOG: '252588.45',
      canjeBBOG: '0',
      disponibleBBOG: '222355.87',
      null: '',
      rentBrutaBBOG: '0',
    },
  },
  amount: '444444',
  operation: 'investment',
  account: {
    productBank: 'Banco de Bogota',
    bankId:
      'NwBw1P33I1AtbCdxtHgicOtHJ0dILQsQIxSMwHIqVvG4U2STTXi4Lm1wk6MUkSF+U4sad3gyrZpd17nqG5l2DLrvzYFca5a78kAp/fPJtoCLgZ3M0Z9yC262SdtfInuZpnx5hNMp7XA8jeGceEblZQgFkP5BX11whZt3UutPTivHMKzeUDwcjr3jtNA/yW7WpFJfPSpWoZtFxAQovnrl90MdZpjx5L4MzY3YcZL8HtXQLz8es1sqq35pQVbtW9gGutj+JoTVyecuChvKgwx4LnoVzmlVKMOtDs5obSVSZ8BWzUmjCgRbiucQi5cjpqawNc2QVD5+/ryaBZMHEGfNLA==',
    isAval: true,
    isActive: true,
    productName: 'Cuenta de Ahorros Premium',
    productType: 'ST',
    productNumber: '047415161',
    category: 'AC',
    description: 'Disponible',
    amount: '27811881',
    productNumberX:
      'd32CYNqLt1CyvFhr6dPNkpkYuvgStwiTdiIsOwEM78f4dDhlpjJ++cwBZ6vUE2EFQXlOFnpNjauon/8BLMP4dW3BHKxcq3cuqOsyZDatVPH23ylmeZg12Bvssn2jRm93lWbo1PCE/qy71Ht6V6FjR2ZIGHtkx7ILYe9P0QQ9cq+OhGZYEkPXXD3m2H14eo/O7uWm1cT0B6lIaNH6lNdNgTa9Iho1XB0LAQFO8krSOEYAmmOEIagjru7HggrL5Dx87o0X2SJ/rZnNFhLnZ6wx68D/pgbFHNK7jxcRepViZf5GeMTMKARFeStKAHBiVfu5tQmzuT4nq1xA0eOPUOLG7g==',
    favorite: false,
    favoriteTime: 1607546224017,
    valid: true,
    franchise: null,
    productNumberApi: '0047415161',
    openDt: '2019-05-17',
    productTypeBDB: 'SDA',
    productDetailApi: {
      productName: 'Cuenta de Ahorros Premium',
      description: 'Cuenta Premium',
      officeId: '0047',
      productAthType: 'ST',
      productBankType: 'SDA',
      productBankSubType: '098AH',
      productNumber: '0047415161',
      valid: true,
      franchise: '',
      openDate: '2019-05-17',
      status: 'A'
    },
  },
};

describe('TransfersDelegateService', () => {
  const transferAccountServiceMock = jasmine.createSpyObj(
    'TransferAccountService',
    ['doTransfer', 'doInvestment', 'doDivestment', 'useLoan']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransfersDelegateService,
        {
          provide: TransferAccountService,
          useValue: transferAccountServiceMock,
        },
      ],
    }).compileComponents();
    transfersDelegateService = TestBed.get(TransfersDelegateService);

    it('doTransfer inquiry should return data mapped', (done) => {
      const mockRequest = new TransferInfo();

      const mockResponse: DoTransferRs = {
        message: 'Operation success',
        approvalId: '431281',
        requestId: '',
      };

      transferAccountServiceMock.doTransfer.and.returnValue(of(mockResponse));

      const serviceResult = transfersDelegateService.doTransfer(
        mockRequest,
        false
      );
      expect(serviceResult).toBeTruthy();

      serviceResult.subscribe((res) => {
        expect(res).toEqual(mockResponse);
        done();
      });
    });

    it('callFiduciaryOperations investment inquiry should return data mapped', (done) => {
      let mockRequest = new TrustAgreementInfo();
      mockRequest = trustAgreementInfoMockData;

      const mockResponse: DoTransferRs = {
        message: 'Operation success',
        approvalId: '431281',
        requestId: '',
      };

      transferAccountServiceMock.doInvestment.and.returnValue(of(mockResponse));

      const serviceResult = transfersDelegateService.callFiduciaryOperations(
        mockRequest,
        false
      );
      expect(serviceResult).toBeTruthy();

      serviceResult.subscribe((res) => {
        expect(res).toEqual(mockResponse);
        done();
      });
    });

    it('callFiduciaryOperations divestment inquiry should return data mapped', (done) => {
      let mockRequest = new TrustAgreementInfo();
      mockRequest = trustAgreementInfoMockData;
      mockRequest.operation = 'divestment';

      const mockResponse: DoTransferRs = {
        message: 'Operation success',
        approvalId: '431281',
        requestId: '',
      };

      transferAccountServiceMock.doDivestment.and.returnValue(of(mockResponse));

      const serviceResult = transfersDelegateService.callFiduciaryOperations(
        mockRequest,
        false
      );
      expect(serviceResult).toBeTruthy();

      serviceResult.subscribe((res) => {
        expect(res).toEqual(mockResponse);
        done();
      });
    });
  });
});
