import React from 'react';
import '@testing-library/jest-dom';

import { cleanup, createEvent, fireEvent, render, screen, waitFor } from '../../../../test-utils/provider-mock';
import server, { productsWithBalance } from '../../../../test-utils/api-mock';
import TransferAccount from './TransferAccount';
import store from '../../../../store';
import { sherpaEvent } from '../../../../test-utils/sherpa-event';
import { productsActions } from '../../../../store/products/products.reducer';
import { BetweenAccountPaths } from '../../constants/navigation-paths';
import { affiliatedAccountsActions } from '../../../../store/affiliated-accounts/afilliated-accounts.reducer';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: BetweenAccountPaths.TRANSFER_TO_ACCOUNT_AMOUNT
  })
}));

describe('TransferAccount amount form', () => {
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

  const fillAmountForm = (amountValue: string, noteValue: string, numberOfBillValue: string) => {
    const amount = screen.getByTestId('amount') as HTMLBdbAtInputElement;
    sherpaEvent.type(amount, { value: amountValue });

    const note = screen.getByTestId('note') as HTMLBdbAtInputElement;
    sherpaEvent.type(note, { value: noteValue });

    const numberOfBill = screen.getByTestId('numberOfBill') as HTMLBdbAtInputElement;
    sherpaEvent.type(numberOfBill, { value: numberOfBillValue });
  };

  test('Should load the page', async () => {
    const transferAccount = render(<TransferAccount />);
    expect(transferAccount).toBeTruthy();
  });

  test('Should click go back in header', async () => {
    const transferAccount = render(<TransferAccount />);

    const header: HTMLElement = (await waitFor(() => screen.getByTestId('header'))) as HTMLBdbMlHeaderBvElement;

    const clickForGoBack: Event & { detail?: unknown } = createEvent('backBtnClicked', header);

    header.dispatchEvent(clickForGoBack);
    fireEvent(header, clickForGoBack);

    expect(transferAccount).toBeTruthy();
    cleanup();
  });

  test('Should click go forward in header', async () => {
    const transferAccount = render(<TransferAccount />);

    const header: HTMLElement = (await waitFor(() => screen.getByTestId('header'))) as HTMLBdbMlHeaderBvElement;

    const clickForGoBack: Event & { detail?: unknown } = createEvent('forwardBtnClicked', header);

    header.dispatchEvent(clickForGoBack);
    fireEvent(header, clickForGoBack);

    expect(transferAccount).toBeTruthy();
    cleanup();
  });

  test('Should click continue on the button without number decimals', async () => {
    const transferAccount = render(<TransferAccount />);
    await waitFor(() => screen.getByTestId('transfer-form'));
    fillAmountForm('123', 'note', 'my facture');

    await waitFor(() => screen.getByTestId('header'));

    const button = screen.getByText('Continuar');
    await waitFor(() => fireEvent.submit(button), { timeout: 100 });
    expect(transferAccount).toBeTruthy();
    cleanup();
  });

  test('Should click continue on the button with decimals numbers', async () => {
    const transferAccount = render(<TransferAccount />);
    await waitFor(() => screen.getByTestId('transfer-form'));
    fillAmountForm('123.2', '', '');

    await waitFor(() => screen.getByTestId('header'));

    const button = screen.getByText('Continuar');
    await waitFor(() => fireEvent.submit(button), { timeout: 100 });
    expect(transferAccount).toBeTruthy();
    cleanup();
  });
});
