import React from 'react';
import '@testing-library/jest-dom';
import server, { login } from '@test-utils/api-mock';
import store from '@store/index';
import Login from './Login';
import { render, waitFor, screen, createEvent, act, fireEvent } from '@test-utils/provider-mock';
import { carouselOptions } from '@login/constants/login-page-constants';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

jest.mock('@avaldigitallabs/bbog-pb-lib-frontend-commons', () => ({
  loginSetup: jest.fn().mockImplementation(() => ({ login })),
  decrypt: jest.fn().mockImplementation(() => 'encypt'),
  encrypt: jest.fn().mockImplementation(() => 'decrypt'),
  BusinessErrorCodes: { Challenge: 'CHALLENGE' }
}));

describe('Login', () => {
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
    const loginPage = render(<Login />);
    expect(loginPage).toBeTruthy();
  });

  test('should open modalProducts form carousel', async () => {
    const mockSetState = jest.spyOn(React, 'useState');
    render(<Login />);
    const horizontalSelector = (await waitFor(() =>
      screen.getByTestId('carousel')
    )) as HTMLBdbMlHorizontalSelectorElement;
    const clickEvent: Event & { detail?: unknown } = createEvent('mlHorizontalSelectorClicked', horizontalSelector);
    act(() => {
      clickEvent.detail = carouselOptions[0];
      horizontalSelector.dispatchEvent(clickEvent);
    });
    const closeButton = await waitFor(() => screen.getByTestId('modal-close-button'));
    fireEvent.click(closeButton);

    expect(mockSetState).toHaveBeenCalled();
  });

  test('should open link from carousel', async () => {
    const mockedOpen = jest.fn();
    window.open = mockedOpen;

    render(<Login />);
    const horizontalSelector = (await waitFor(() =>
      screen.getByTestId('carousel')
    )) as HTMLBdbMlHorizontalSelectorElement;
    const clickEvent: Event & { detail?: unknown } = createEvent('mlHorizontalSelectorClicked', horizontalSelector);
    clickEvent.detail = carouselOptions[1];
    horizontalSelector.dispatchEvent(clickEvent);

    expect(mockedOpen).toBeCalled();
  });

  test('should open modal information from carousel', async () => {
    render(<Login />);
    const horizontalSelector = (await waitFor(() =>
      screen.getByTestId('carousel')
    )) as HTMLBdbMlHorizontalSelectorElement;
    const clickEvent: Event & { detail?: unknown } = createEvent('mlHorizontalSelectorClicked', horizontalSelector);
    clickEvent.detail = carouselOptions[2];
    horizontalSelector.dispatchEvent(clickEvent);

    const informationModal = (await waitFor(() => screen.getByTestId('notification-modal'))) as HTMLBdbMlModalElement;
    expect(informationModal.titleModal).toEqual('Líneas de Atención');

    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', informationModal);
    clickAction.detail = { value: 'Entendido' };
    informationModal.dispatchEvent(clickAction);
    fireEvent(informationModal, clickAction);
    expect(informationModal).toBeTruthy();
  });
});
