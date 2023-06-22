import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, waitForElementToBeRemoved } from '../../../test-utils/provider-mock';
import App from '../../../App';
import store from '../../../store';
import userEvent from '@testing-library/user-event';
import LimitsForm from './LimitsForm';
import server from '../../../test-utils/api-mock';
import { rest } from 'msw';

jest.mock('../../hooks/url-paramater.hook', () => ({
  useQuery: () => ({ get: jest.fn().mockReturnValue('') })
}));

describe('LimitsForm', () => {
  const OLD_ENV = process.env;
  const navigate = jest.fn();
  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch({ type: 'UNMOUNT' });
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
  });

  afterEach(() => {
    server.resetHandlers();
    process.env = OLD_ENV;
  });

  afterAll(() => {
    server.close();
  });

  test('should render component', () => {
    const app = render(<LimitsForm navigate={navigate} />);
    expect(app).toBeTruthy();
  });

  test('should enable limits', async () => {
    window.history.pushState({}, 'Limits Form page', '/settings/limits-form');

    const app = render(<App navigate={navigate} />);
    await waitFor(() => screen.getByTestId('limits-form-page'));
    const pulseItems = app.container.querySelectorAll('pulse-list-item');

    pulseItems.forEach(pulseItem => {
      expect(pulseItem.getAttribute('isdisabled')).toEqual('true');
    });

    const enableLimitsButton = screen.getByText('Editar topes');
    userEvent.click(enableLimitsButton);

    await waitFor(() => screen.getByTestId('token-input-text'));

    const tokenInput = screen.getByTestId('token-input-text');

    userEvent.type(tokenInput, '801084');

    const sendTokenButton = screen.getByText('Continuar');
    userEvent.click(sendTokenButton);

    await waitForElementToBeRemoved(screen.getByTestId('token-input-text'));

    pulseItems.forEach(pulseItem => {
      expect(pulseItem.getAttribute('isdisabled')).toEqual('false');
    });
  });

  test('should not enable limits edition if token is dismissed', async () => {
    window.history.pushState({}, 'Limits Form page', '/settings/limits-form');

    const app = render(<App navigate={navigate} />);
    await waitFor(() => screen.getByTestId('limits-form-page'));
    const pulseItems = app.container.querySelectorAll('pulse-list-item');

    pulseItems.forEach(pulseItem => {
      expect(pulseItem.getAttribute('isdisabled')).toEqual('true');
    });

    const enableLimitsButton = screen.getByText('Editar topes');
    userEvent.click(enableLimitsButton);

    await waitFor(() => screen.getByTestId('close-modal-token-button'));

    const closeModalButton = screen.getByTestId('close-modal-token-button');
    userEvent.click(closeModalButton);

    pulseItems.forEach(pulseItem => {
      expect(pulseItem.getAttribute('isdisabled')).toEqual('true');
    });
  });

  test('should show error modal if limits fail to load', async () => {
    server.use(
      rest.post('/api-gateway/customer-security/get-limits', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    window.history.pushState({}, 'Limits Form page', '/settings/limits-form');
    render(<App navigate={navigate} />);
    await waitFor(() => screen.getByTestId('limits-form-page'));
    await waitFor(() => screen.getByText('Error al cargar los Topes'));

    expect(screen.getByText('Error al cargar los Topes')).toBeInTheDocument();
    expect(
      screen.getByText('En estos momentos no pudimos cargar los Topes de tu cuenta. Por favor intenta nuevamente.')
    ).toBeInTheDocument();
  });

  test('should call navigation callback when logout button is pressed', async () => {
    window.history.pushState({}, 'Limits Form page', '/settings/limits-form');
    render(<App navigate={navigate} />);

    navigate.mockClear();

    const backButton = screen.getByText('Salida segura');
    userEvent.click(backButton);

    expect(navigate.mock.calls.length).toBe(1);
    expect(navigate).toHaveBeenCalledWith('/logout');
  });

  // FIX: tooltip is not hidding
  xtest('should hide edit limits tooltip on click close button', async () => {
    window.history.pushState({}, 'Limits Form page', '/settings/limits-form');
    render(<App navigate={navigate} />);

    await waitFor(() => screen.getByTestId('tooltip'));

    const tooltip = screen.getByTestId('tooltip');

    const closeTooltipEvent = new Event('onCloseChange');
    tooltip.dispatchEvent(closeTooltipEvent);

    await waitForElementToBeRemoved(screen.getByTestId('tooltip'));

    const tooltipRemoved = screen.queryByTestId('tooltip');
    expect(tooltipRemoved).toBeNull();
  });

  test('should show warning modal if the user does not have token', async () => {
    server.use(
      rest.post('/api-gateway/validation/token/info', (req, res, ctx) =>
        res(
          ctx.json({
            id: '31231',
            status: 'Asignado',
            type: 'Mobile'
          })
        )
      )
    );
    window.history.pushState({}, 'Limits Form page', '/settings/limits-form');
    render(<App navigate={navigate} />);
    await waitFor(() => screen.getByTestId('limits-form-page'));

    const enableLimitsButton = screen.getByText('Editar topes');
    userEvent.click(enableLimitsButton);

    await waitFor(() => screen.getByText('Activa tu Token Móvil'));
    expect(screen.getByText('Activa tu Token Móvil')).toBeInTheDocument();
  });

  test('should show error modal if the user tries 3 times wrong', async () => {
    window.history.pushState({}, 'Limits Form page', '/settings/limits-form');
    server.use(rest.post('/api-gateway/validation/validate-otp', (req, res, ctx) => res(ctx.status(409))));
    render(<App navigate={navigate} />);
    await waitFor(() => screen.getByTestId('limits-form-page'));

    const enableLimitsButton = screen.getByText('Editar topes');
    userEvent.click(enableLimitsButton);

    await waitFor(() => screen.getByTestId('token-input-text'));

    const tokenInput = screen.getByTestId('token-input-text');

    userEvent.type(tokenInput, '801084');

    const sendTokenButton = screen.getByText('Continuar');
    userEvent.click(sendTokenButton);
    await waitFor(() => screen.getByText('Código incorrecto, te quedan 2 intentos'));
    userEvent.type(tokenInput, '801084');
    userEvent.click(sendTokenButton);
    await waitFor(() => screen.getByText('Código incorrecto, te queda 1 intento'));
    userEvent.type(tokenInput, '801084');
    userEvent.click(sendTokenButton);
    await waitFor(() => screen.getByText('Algo ocurrió con tu Token'));
    expect(screen.getByText('Algo ocurrió con tu Token')).toBeInTheDocument();
  });
});
