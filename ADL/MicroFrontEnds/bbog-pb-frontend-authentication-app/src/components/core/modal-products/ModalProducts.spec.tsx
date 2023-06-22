import React from 'react';
import '@testing-library/jest-dom';
import server from '@test-utils/api-mock';
import store from '../../../store';
import ModalProducts from './ModalProducts';
import { render, waitFor, screen, createEvent, act } from '@test-utils/provider-mock';
import { products } from '@login/constants/login-page-constants';

describe('ModalProducts', () => {
  const OLD_ENV = process.env;
  const title = 'Solicita un nuevo producto';

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

  test('should render ModalProducts component', async () => {
    const modalProducts = render(<ModalProducts title={title} data={products} />);
    expect(modalProducts).toBeTruthy();
  });

  test('should close ModalProducts', async () => {
    const mockSetState = jest.spyOn(React, 'useState');
    render(<ModalProducts title={title} data={products} onClose={() => jest.fn()} />);

    const backdrop = (await waitFor(() => screen.getByTestId('modal-backdrop'))) as HTMLBdbAtBackdropElement;
    const clickEvent: Event & { detail?: unknown } = createEvent('backDropClosed', backdrop);
    act(() => {
      clickEvent.detail = {};
      backdrop.dispatchEvent(clickEvent);
    });

    expect(mockSetState).toHaveBeenCalled();
  });

  test('should select product', async () => {
    const mockedOpen = jest.fn();
    window.open = mockedOpen;

    render(<ModalProducts title={title} data={products} onClose={() => jest.fn()} />);
    const multiActon = (await waitFor(() => screen.getByTestId('options'))) as HTMLBdbMlMultiActionElement;
    const clickEvent: Event & { detail?: unknown } = createEvent('cardClicked', multiActon);
    act(() => {
      clickEvent.detail = products[0];
      multiActon.dispatchEvent(clickEvent);
    });

    expect(mockedOpen).toBeCalled();
  });
});
