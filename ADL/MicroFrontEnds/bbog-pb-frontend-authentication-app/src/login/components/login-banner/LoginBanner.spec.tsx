import React from 'react';
import '@testing-library/jest-dom';
import server from '@test-utils/api-mock';
import store from '../../../store';
import LoginBanner from './LoginBanner';
import { render, waitFor, screen } from '@test-utils/provider-mock';

describe('LoginBanner', () => {
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

  test('should render LoginBanner component', () => {
    const loginBanner = render(<LoginBanner />);
    expect(loginBanner).toBeTruthy();
  });

  test('should show default text banner', async () => {
    render(<LoginBanner />);
    await waitFor(() => screen.getByTestId('login-banner'));
    const bannerText = screen.getByText('Nos estamos renovando con todo lo que necesitas.');
    expect(bannerText).toBeInTheDocument();
  });
});
