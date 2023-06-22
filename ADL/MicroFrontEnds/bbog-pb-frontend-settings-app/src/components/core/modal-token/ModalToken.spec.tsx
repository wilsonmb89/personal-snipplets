import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import { render, waitFor, screen } from '../../../test-utils/provider-mock';
import userEvent from '@testing-library/user-event';
import ModalToken from './ModalToken';
import React from 'react';
import store from '../../../store';

const server = setupServer(
  rest.post('/api-gateway/validation/token/info', (req, res, ctx) =>
    res(
      ctx.json({
        id: '31231',
        status: 'Activo',
        type: 'Mobile'
      })
    )
  ),
  rest.post('/api-gateway/validation/validate-otp', (req, res, ctx) =>
    res(
      ctx.json({
        approvalId: '801084'
      })
    )
  )
);

describe('ModalToken', () => {
  const OLD_ENV = process.env;
  const onSuccess = () => console.log('SUCCESS');
  const onClose = () => console.log('CLOSE');

  beforeEach(() => {
    store.dispatch({ type: 'UNMOUNT' });
  });

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  test('should render component', () => {
    const modal = render(<ModalToken onClose={onClose} onSuccess={onSuccess}></ModalToken>);
    expect(modal).toBeTruthy();
  });

  test('should try a slice input for token', async () => {
    render(<ModalToken onClose={onClose} onSuccess={onSuccess}></ModalToken>);
    const inputText = screen.getByTestId('token-input-text') as HTMLInputElement;

    userEvent.type(inputText, '8010841');
    await waitFor(() => {
      expect(inputText).toHaveValue(801084);
      1310;
    });
  });
});
