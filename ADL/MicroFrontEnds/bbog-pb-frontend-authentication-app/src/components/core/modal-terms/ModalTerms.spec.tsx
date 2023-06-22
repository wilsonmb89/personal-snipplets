import React from 'react';
import { rest } from 'msw';
import store from '@store/index';
import server, { getUserSettingsResponse } from '@test-utils/api-mock';
import { createEvent, render, screen, waitFor } from '@test-utils/provider-mock';
import ModalTerms, { ModalTermsData } from './ModalTerms';
import showTermsAndConditionsModal from '.';

describe('Modal termns unit test', () => {
  const OLD_ENV = process.env;
  const { location } = window;

  beforeAll(() => {
    delete window.location;
    window.location = { ...window.location, reload: jest.fn() };
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterAll(() => {
    window.location = location;
    process.env = OLD_ENV;
    server.close();
  });

  const onSuccess = jest.fn();
  const onError = jest.fn();

  const originalWindow = { ...window };
  const termsAndConditionsItem = [
    {
      version: null,
      acceptedDate: null
    }
  ];

  const loginData: ModalTermsData = {
    isLoginWeb: false,
    windowTop: originalWindow,
    termsAndConditions: termsAndConditionsItem
  };

  test('Should load the modal terms', async () => {
    window.location.reload();
    showTermsAndConditionsModal(loginData);
    const modalTerms = await waitFor(() => screen.getByTestId('modal-terms'));
    expect(modalTerms).toBeTruthy();
    const clickCloseModalEvent: Event = createEvent('clickedAcceptTermsBtn', modalTerms);
    modalTerms.dispatchEvent(clickCloseModalEvent);
  });

  test('Should load the modal terms and get HTTP error', async () => {
    window.location.reload();
    server.use(
      rest.post('/user-features/user-settings', (req, res, ctx) =>
        res(ctx.status(500), ctx.json(getUserSettingsResponse))
      )
    );
    showTermsAndConditionsModal(loginData);
    const modalTerms = await waitFor(() => screen.getByTestId('modal-terms'));
    expect(modalTerms).toBeTruthy();
    const clickCloseModalEvent: Event = createEvent('clickedAcceptTermsBtn', modalTerms);
    modalTerms.dispatchEvent(clickCloseModalEvent);
  });

  test('Should load the modal terms from a render', async () => {
    render(<ModalTerms loginData={loginData} onSuccess={onSuccess} onError={onError} />);
    const modalTerms = await waitFor(() => screen.getByTestId('modal-terms'));
    expect(modalTerms).toBeTruthy();
    const clickCloseModalEvent: Event = createEvent('clickedAcceptTermsBtn', modalTerms);
    modalTerms.dispatchEvent(clickCloseModalEvent);
  });
});
