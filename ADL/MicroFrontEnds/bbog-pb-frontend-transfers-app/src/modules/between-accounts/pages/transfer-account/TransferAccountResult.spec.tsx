import React from 'react';
import '@testing-library/jest-dom';

import { act, cleanup, createEvent, render, screen, waitFor } from '../../../../test-utils/provider-mock';
import server, { productsWithBalance } from '../../../../test-utils/api-mock';
import TransferAccount from './TransferAccount';
import store from '../../../../store';
import { productsActions } from '../../../../store/products/products.reducer';
import { BetweenAccountPaths } from '../../constants/navigation-paths';
import { affiliatedAccountsActions } from '../../../../store/affiliated-accounts/afilliated-accounts.reducer';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: BetweenAccountPaths.RESULT_OF_TRANSFER
  })
}));

describe('TransferAccount result', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch(productsActions.fetchProductsSuccess([productsWithBalance[0]]));
    store.dispatch({ type: 'UNMOUNT' });
    store.dispatch(
      affiliatedAccountsActions.fetchAffiliatedAccounts([
        {
          bankId: '001',
          productAlias: '',
          productNumber: '123',
          productType: 'CMA'
        }
      ])
    );
    store.dispatch(
      affiliatedAccountsActions.setAccountAffiliatedSelected({
        bankId: '001',
        productAlias: '',
        productNumber: '123',
        productType: 'CMA'
      })
    );
  });

  afterEach(() => {
    sessionStorage.clear();
    server.resetHandlers();
  });

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  test('Should load the page', async () => {
    const transferAccount = render(<TransferAccount />);
    expect(transferAccount).toBeTruthy();
    cleanup();
  });

  test('Should emulate of click in button other transfers', async () => {
    act(() => {
      render(<TransferAccount />);
    });

    const voucher: HTMLElement = (await waitFor(() => screen.getByTestId('voucher'))) as HTMLBdbMlBmVoucherElement;

    const clickButtonOk: Event & { detail?: unknown } = createEvent('buttonOk', voucher);

    voucher.dispatchEvent(clickButtonOk);
    cleanup();
  });
});
