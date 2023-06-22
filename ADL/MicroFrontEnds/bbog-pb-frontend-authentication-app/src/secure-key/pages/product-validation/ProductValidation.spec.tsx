import React from 'react';
import '@testing-library/jest-dom';
import store from '../../../store';
import ProductValidation from './ProductValidation';
import { act, render, waitFor, screen, fireEvent, createEvent, unrender } from '@test-utils/provider-mock';
import sherpaEvent from '@test-utils/sherpa-event';
import { customerActions } from '@secure-key/store/customer/customer.store';
import { validationProductsActions } from '@secure-key/store/validation-products/validation-products.reducer';
import { otpActions } from '@secure-key/store/otp-auth/otp-auth.reducer';
import { getProductDetail, ProductValidationType } from '@utils/product-validation-util';
import { rest } from 'msw';
import { axiosADLInstance } from '@utils/axios-instance';
import server, {
  getRegisterBasicDataRes,
  getValidProductsCDTRes,
  getValidProductsTDRes,
  otpAuthResponse
} from '@test-utils/api-mock';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedUseNavigate
}));

axiosADLInstance.interceptors.response.use(
  successRes => {
    return successRes;
  },
  error => {
    return Promise.reject({
      message: error.response.data.message,
      name: error.response.data.name,
      type: error.response.data.type,
      status: error.response.status,
      data: error.response.data.data
    });
  }
);

describe('ProductValidation', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(async () => {
    store.dispatch({ type: 'UNMOUNT' });
    store.dispatch(customerActions.setIsForgetFlow(true));
    store.dispatch(customerActions.setBasicData(getRegisterBasicDataRes.forget));
    store.dispatch(validationProductsActions.setValidationProducts(getValidProductsTDRes));
    store.dispatch(validationProductsActions.setProductToValidate(getProductDetail(ProductValidationType.DEB)));
    store.dispatch(otpActions.setOtpResponse(otpAuthResponse));
  });

  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
    unrender();
  });

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  test('should render ProductValidation page', () => {
    const productValidationPage = render(<ProductValidation />);
    expect(productValidationPage).toBeTruthy();
  });

  test('should send product debit card validation', async () => {
    render(<ProductValidation />);
    await waitFor(() => screen.getByTestId('product-validation'));
    const productNumber = screen.getByTestId('product-number') as HTMLBdbAtInputElement;
    const productKey = screen.getByTestId('product-key') as HTMLBdbAtInputElement;
    const button = screen.getByText('Verificar');

    await act(async () => {
      sherpaEvent.type(productNumber, { value: '1355' });
      sherpaEvent.type(productKey, { value: '1234' });
      fireEvent.submit(button);
    });
    expect(productNumber).toBeTruthy();
  });

  test('should send product invalid debit card', async () => {
    render(<ProductValidation />);
    await waitFor(() => screen.getByTestId('product-validation'));

    const productNumber = screen.getByTestId('product-number') as HTMLBdbAtInputElement;
    const productKey = screen.getByTestId('product-key') as HTMLBdbAtInputElement;
    const button = screen.getByText('Verificar');

    await act(async () => {
      sherpaEvent.type(productNumber, { value: '1111' });
      sherpaEvent.type(productKey, { value: '1234' });
      fireEvent.submit(button);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
  });

  test('should send product debit validation server error', async () => {
    server.use(
      rest.post('/api-gateway/register-checked/validate-pin', (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<ProductValidation />);
    await waitFor(() => screen.getByTestId('product-validation'));

    const productNumber = screen.getByTestId('product-number') as HTMLBdbAtInputElement;
    const productKey = screen.getByTestId('product-key') as HTMLBdbAtInputElement;
    const button = screen.getByText('Verificar');

    await act(async () => {
      sherpaEvent.type(productNumber, { value: '1355' });
      sherpaEvent.type(productKey, { value: '1234' });
      fireEvent.submit(button);
    });
    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
  });

  test('should block product exceed attempts', async () => {
    server.use(rest.post('/api-gateway/register-checked/validate-pin', (_req, res, ctx) => res(ctx.status(409))));
    render(<ProductValidation />);
    await waitFor(() => screen.getByTestId('product-validation'));

    const productNumber = screen.getByTestId('product-number') as HTMLBdbAtInputElement;
    const productKey = screen.getByTestId('product-key') as HTMLBdbAtInputElement;
    const button = screen.getByText('Verificar');
    const invalidKeys = ['1111', '2222', '3333', '4444'];
    for (let i = 0; i < invalidKeys.length; i++) {
      await act(async () => {
        sherpaEvent.type(productNumber, { value: '1355' });
        sherpaEvent.type(productKey, { value: invalidKeys[i] });
        fireEvent.submit(button);
      });
    }

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);

    const modalText = screen.getByText(
      'Por tu seguridad, tu producto ha sido bloqueado y no podemos continuar con el proceso de olvido de clave.'
    );
    expect(modalText).toBeInTheDocument();

    clickAction.detail = { value: 'Entendido' };
    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
  });

  test('should send product cdt validation', async () => {
    store.dispatch(validationProductsActions.setValidationProducts(getValidProductsCDTRes));
    store.dispatch(validationProductsActions.setProductToValidate(getProductDetail(ProductValidationType.CDA)));
    render(<ProductValidation />);
    await waitFor(() => screen.getByTestId('product-validation'));
    const productKey = screen.getByTestId('product-key') as HTMLBdbAtInputElement;
    const button = screen.getByText('Verificar');

    await act(async () => {
      sherpaEvent.type(productKey, { value: '12344567890' });
      fireEvent.submit(button);
    });
    await new Promise(r => setTimeout(r, 1000));

    expect(productKey).toBeTruthy();
  });
});
