import { TestBed } from '@angular/core/testing';
import { buildMockResponse, expectObject, mockHttpClientInfo } from '../services-apis.spec';
import { DoTransferRq, DoTransferRs } from './models/doTrasfer.model';
import { TransferAccountService } from './transfer-account.service';

let transferAccountService: TransferAccountService;

describe('TransferAccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransferAccountService, mockHttpClientInfo],
    }).compileComponents();
    transferAccountService = TestBed.get(TransferAccountService);
  });

  it('should post request DoTransfer', (done) => {
    const doTransferRqMock = new DoTransferRq(
      10000,
      '0011223344',
      'SDA',
      '001',
      '1234',
      '0099887766',
      'SDA',
      '004',
      '001',
      'Mock transfer test',
      '12345',
      false
    );

    const doTransferRsMock: DoTransferRs = {
      message: 'OK',
      approvalId: '1234567',
      requestId: '12345678',
    };
    buildMockResponse(doTransferRsMock);

    const result = transferAccountService.doTransfer(doTransferRqMock);
    expectObject(result, doTransferRsMock, done);
  });

  it('should post request DoInvestment', (done) => {
    const doInvestmentRqMock = new DoTransferRq(
      10000,
      '0011223344',
      'SDA',
      '001',
      '1234',
      '0099887766',
      'SDA',
      '004',
      '001',
      'Mock transfer test',
      '12345',
      false
    );

    const doInvestmentRsMock: DoTransferRs = {
      message: 'OK',
      approvalId: '1234567',
      requestId: '12345678',
    };
    buildMockResponse(doInvestmentRsMock);

    const result = transferAccountService.doInvestment(doInvestmentRqMock);
    expectObject(result, doInvestmentRsMock, done);
  });

  it('should post request DoDivestment', (done) => {
    const doDivestmentRqMock = new DoTransferRq(
      10000,
      '0011223344',
      'SDA',
      '001',
      '1234',
      '0099887766',
      'SDA',
      '004',
      '001',
      'Mock transfer test',
      '12345',
      false
    );

    const doDivestmentRsMock: DoTransferRs = {
      message: 'OK',
      approvalId: '1234567',
      requestId: '12345678',
    };
    buildMockResponse(doDivestmentRsMock);

    const result = transferAccountService.doDivestment(doDivestmentRqMock);
    expectObject(result, doDivestmentRsMock, done);
  });
});
