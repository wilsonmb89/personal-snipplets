import {HttpClientWrapperProvider} from '../http/http-client-wrapper/http-client-wrapper.service';
import {of} from 'rxjs/observable/of';

const mockHttpClientWrapper = jasmine.createSpyObj('HttpClientWrapperProvider', ['postToADLApi']);

export const mockHttpClientInfo =  { provide: HttpClientWrapperProvider, useValue: mockHttpClientWrapper };

export const buildMockResponse = (rs) => {
 mockHttpClientWrapper.postToADLApi.and.returnValue(
      of(rs)
    );
};

export const expectObject = (actual, expected, done) => {
  expect(actual).toBeTruthy();
  actual.subscribe(r => {
    expect(r).toBe(expected);
    done();
  });
};



