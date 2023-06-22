import {TestBed} from '@angular/core/testing';
import {buildMockResponse, expectObject, mockHttpClientInfo} from '@app/apis/services-apis.spec';
import {ValidationApiService} from '@app/apis/identity-validation/validation-api.service';
import {LastLoginRs} from '@app/apis/identity-validation/models/last-login.model';

let validationApiService: ValidationApiService;


describe('ValidationApiService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(
      {providers: [ValidationApiService, mockHttpClientInfo]})
      .compileComponents();
    validationApiService = TestBed.get(ValidationApiService);
  });

  it('should post request GetLastLogin', (done) => {
    const mock: LastLoginRs = {
      currentIp: '181.53.13.252',
      currentTime: '01/12/2020 11:31 AM',
      lastLoginTime: '30/11/2020 10:23 AM'
    };

    buildMockResponse(mock);
    const result = validationApiService.getLastLogin();
    expectObject(result, mock, done);
  });

});


