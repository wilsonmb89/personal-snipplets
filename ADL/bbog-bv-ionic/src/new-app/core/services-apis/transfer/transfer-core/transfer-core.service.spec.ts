import { TestBed } from '@angular/core/testing';
import { buildMockResponse, expectObject, mockHttpClientInfo } from '@app/apis/services-apis.spec';
import { GetAffiliatedAccountsRs } from './models/getAffiliatedAccounts.model';
import { SubscribeTransferAcctRq } from './models/subscribe-transfer-acct.model';
import { TransferCoreService } from './transfer-core.service';
import {GetPaymentObligationsRs} from '@app/apis/transfer/transfer-core/models/payment-obligations.model';

let transferCoreService: TransferCoreService;

describe('TransferCoreService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(
      {providers: [TransferCoreService, mockHttpClientInfo]})
      .compileComponents();
      transferCoreService = TestBed.get(TransferCoreService);
  });

  it('should post request GetAffiliatedAccounts', (done) => {

    const getAffiliatedAccountsRsMock: GetAffiliatedAccountsRs = {
      acctBalancesList: [
        {
          aval: true,
          bankId: '001',
          contraction: '1111',
          customer: {
            name: 'Diego Mock Test',
            identificationNumber: '1014204333',
            identificationType: 'CC'
          },
          description: '',
          priority: '',
          productAlias: 'Cta corriente',
          productBank: 'Banco Mock Test',
          productName: 'Cuenta corriente mock',
          productNumber: '1123123234234',
          productType: 'SDA'
        }
      ]
    };

    buildMockResponse(getAffiliatedAccountsRsMock);

    const result = transferCoreService.getAffiliatedAccounts();
    expectObject(result, getAffiliatedAccountsRsMock, done);
  });

  it('should post request GetPaymentObligations', (done) => {

    const getPaymentObligationsRsMock: GetPaymentObligationsRs = {
      paymentObligations: [
        {
          aval: true,
          bankId: '001',
          franchise: '',
          productAlias: 'Cta corriente',
          productBank: 'Banco Mock Test',
          productName: 'Cuenta corriente mock',
          productNumber: '1123123234234',
          productType: 'SDA'
        }
      ]
    };

    buildMockResponse(getPaymentObligationsRsMock);

    const result = transferCoreService.getCreditCardPaymentObligations();
    expectObject(result, getPaymentObligationsRsMock, done);
  });

  it('should post request SubscribeTransferAcct', (done) => {

    const subscribeTransferAcctRqMock: SubscribeTransferAcctRq = {
      nickName: 'Acueducto Alcantarillado Bogota',
      targetAccountId: '00122300',
      targetAccountType: 'SDA',
      targetBankId: '001',
      targetIdNumber: '123423423',
      targetIdType: 'CC',
      targetName: 'Servicios publicos'
    };

    const subscribeTransferAcctRsMock = {
      message: 'OK',
      approvalId: '1234567',
      requestId: '12345678',
    };

    buildMockResponse(subscribeTransferAcctRsMock);

    const result = transferCoreService.subscribeTransferAccount(subscribeTransferAcctRqMock);
    expectObject(result, subscribeTransferAcctRsMock, done);
  });
});
