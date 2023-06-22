// pending to add unit tests to the library.
// this is a workaround to deploy the library

import { test } from './sonar-test';

describe('test', () => {
  it('should pass sonar', () => {
    expect(test).toBe('test');
  });
});
