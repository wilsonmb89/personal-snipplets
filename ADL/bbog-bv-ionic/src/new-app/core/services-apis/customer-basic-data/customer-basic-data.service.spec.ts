import { TestBed } from '@angular/core/testing';
import {
  buildMockResponse,
  expectObject,
  mockHttpClientInfo,
} from '@app/apis/services-apis.spec';
import { CustomerBasicDataService } from './customer-basic-data.service';
import { GetAllBasicDataRs } from './models/getAll.model';
import { BasicDataRs } from './models/getBasicData.model';
import {
  UpdateBasicDataRq,
  UpdateBasicDataRs,
} from './models/updateBasicData.model';
import { getAllBasicDataMock, updateBasicDataMock } from './models/unitTestMockData';

let customerBasicDataService: CustomerBasicDataService;

describe('CustomerBasicDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerBasicDataService, mockHttpClientInfo],
    }).compileComponents();
    customerBasicDataService = TestBed.get(CustomerBasicDataService);
  });

  it('should post request getBasicData()', (done) => {
    const mock: BasicDataRs = {
      phone: '123456',
      emailAddr: '1234@34567',
      secondLastName: 'Mass',
      lastName: 'Juan',
      middleName: 'string',
      firstName: 'string',
      cdtOwner: false,
      phones: null
    };

    buildMockResponse(mock);

    const result = customerBasicDataService.getBasicData();
    expectObject(result, mock, done);
  });

  it('should post request getAll()', (done) => {
    const mock: GetAllBasicDataRs = getAllBasicDataMock;

    buildMockResponse(mock);

    const result = customerBasicDataService.getAll();
    expectObject(result, mock, done);
  });

  it('should post request UpdateBasicDataRq()', (done) => {
    const mockRq: UpdateBasicDataRq = updateBasicDataMock;

    const mockRs: UpdateBasicDataRs = {
      message: 'Operation success',
      approvalId: '0',
      requestId: '',
    };

    buildMockResponse(mockRs);

    const result = customerBasicDataService.updateBasicData(mockRq);
    expectObject(result, mockRs, done);
  });
});
