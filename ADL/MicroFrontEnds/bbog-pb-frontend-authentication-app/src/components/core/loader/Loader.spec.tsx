import React from 'react';
import '@testing-library/jest-dom';
import server from '@test-utils/api-mock';
import store from '../../../store';
import { render } from '@test-utils/provider-mock';
import Loader from './Loader';

describe('Loader', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  test('should render Login page', () => {
    const loginPage = render(<Loader />);
    expect(loginPage).toBeTruthy();
  });
});
