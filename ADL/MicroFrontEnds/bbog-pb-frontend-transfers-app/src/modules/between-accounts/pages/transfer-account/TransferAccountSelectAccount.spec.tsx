import { rest } from 'msw';
import React from 'react';
import '@testing-library/jest-dom';

import { act, cleanup, createEvent, fireEvent, render, screen, waitFor } from '../../../../test-utils/provider-mock';
import server, { productsWithBalance } from '../../../../test-utils/api-mock';
import TransferAccount from './TransferAccount';
import store from '../../../../store';
import { ProductTypes } from '../../../../constants/bank-codes';
import { productsActions } from '../../../../store/products/products.reducer';
import { accountSelectActions } from '../../store/selected/account-selected.reducer';
import { axiosADLInstance } from '@utils/constants';
import { BetweenAccountPaths } from '../../constants/navigation-paths';
import { affiliatedAccountsActions } from '../../../../store/affiliated-accounts/afilliated-accounts.reducer';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: BetweenAccountPaths.TRANSFER_TO_ACCOUNT_SELECT_ACCOUNT
  })
}));

axiosADLInstance.interceptors.response.use(
  successRes => {
    return successRes;
  },
  error => {
    return Promise.reject(error.response);
  }
);

describe('TransferAccount select account', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
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
    store.dispatch(productsActions.fetchProductsSuccess(productsWithBalance));
    const transferAccount = render(<TransferAccount />);
    expect(transferAccount).toBeTruthy();
    cleanup();
  });

  test('Should click on card with multiple accounts and save account selected', async () => {
    store.dispatch(productsActions.fetchProductsSuccess(productsWithBalance));
    const accountForSelect = {
      cardDescription: 'No. 0019904804',
      cardName: 'Cuenta de Ahorros LibreAhorro',
      productNumber: '0019904804',
      productBankType: 'SDA'
    };

    act(() => {
      render(<TransferAccount />);
    });

    const accountSelector: HTMLElement = (await waitFor(() =>
      screen.getByTestId('account-selector')
    )) as HTMLBdbMlCardPriceElement;

    act(() => {
      const clickForCard: Event & { detail?: unknown } = createEvent('cardSelected', accountSelector);
      clickForCard.detail = {
        ...accountForSelect
      };
      accountSelector.dispatchEvent(clickForCard);
      fireEvent(accountSelector, clickForCard);
    });

    const { description, productBankType } = store.getState().transferAccountState.accountTransfer.accountFrom;
    expect(description).toEqual(`${accountForSelect.cardName} ${accountForSelect.cardDescription}`);
    expect(productBankType).toEqual(accountForSelect.productBankType);
    cleanup();
  });

  test('Should load with a single account', async () => {
    store.dispatch(productsActions.fetchProductsSuccess([productsWithBalance[0]]));
    store.dispatch(
      accountSelectActions.setAccountOwnSelected({
        productName: 'Cuenta de ahorros',
        description: 'Cuenta de ahorros No. 123',
        valid: true,
        productNumber: '0019817386',
        franchise: '',
        officeId: '0001',
        openDate: '2018-01-24',
        productBankType: ProductTypes.SAVINGS_ACCOUNT,
        productAthType: 'IM',
        productBankSubType: '010CC'
      })
    );
    act(() => {
      render(<TransferAccount />);
    });
    const accountSelector: HTMLElement = (await waitFor(() =>
      screen.getByTestId('account-selector')
    )) as HTMLBdbMlCardPriceElement;
    expect(accountSelector).toBeTruthy();
    cleanup();
  });

  test('Should click tranfer button and own account selected with successfull response', async () => {
    const responseDoTransfer = {
      approvalId: 123,
      message: 'Sucessfull',
      requestId: '001'
    };
    server.use(
      rest.post('/api-gateway/transfer-account/do-transfer', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.body(JSON.stringify(responseDoTransfer)));
      })
    );
    store.dispatch(productsActions.fetchProductsSuccess(productsWithBalance));
    const accountForSelect = {
      cardDescription: 'No. 0019904804',
      cardName: 'Cuenta de Ahorros LibreAhorro',
      productNumber: '0019904804',
      productBankType: 'SDA'
    };

    act(() => {
      render(<TransferAccount />);
    });

    const accountSelector: HTMLElement = (await waitFor(() =>
      screen.getByTestId('account-selector')
    )) as HTMLBdbMlCardPriceElement;

    act(() => {
      const clickForCard: Event & { detail?: unknown } = createEvent('cardSelected', accountSelector);
      clickForCard.detail = {
        ...accountForSelect
      };
      accountSelector.dispatchEvent(clickForCard);
      fireEvent(accountSelector, clickForCard);
    });

    const { description, productBankType } = store.getState().transferAccountState.accountTransfer.accountFrom;
    expect(description).toEqual(`${accountForSelect.cardName} ${accountForSelect.cardDescription}`);
    expect(productBankType).toEqual(accountForSelect.productBankType);

    act(() => {
      fireEvent(
        screen.getByTestId('transfer-button'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
      );
    });
    expect(accountSelector).toBeTruthy();
    cleanup();
  });

  test('Should click tranfer button and current account selected with successfull response', async () => {
    const responseDoTransfer = {
      approvalId: 123,
      message: 'Sucessfull',
      requestId: '001'
    };
    server.use(
      rest.post('/api-gateway/transfer-account/do-transfer', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.body(JSON.stringify(responseDoTransfer)));
      })
    );
    store.dispatch(productsActions.fetchProductsSuccess(productsWithBalance));
    const accountForSelect = {
      cardDescription: 'No. 0019817386',
      cardName: 'Cuenta corrinte',
      productNumber: '0019817386',
      productBankType: 'DDA'
    };

    act(() => {
      render(<TransferAccount />);
    });

    const accountSelector: HTMLElement = (await waitFor(() =>
      screen.getByTestId('account-selector')
    )) as HTMLBdbMlCardPriceElement;

    act(() => {
      const clickForCard: Event & { detail?: unknown } = createEvent('cardSelected', accountSelector);
      clickForCard.detail = {
        ...accountForSelect
      };
      accountSelector.dispatchEvent(clickForCard);
      fireEvent(accountSelector, clickForCard);
    });

    const { description, productBankType } = store.getState().transferAccountState.accountTransfer.accountFrom;
    expect(description).toEqual(`${accountForSelect.cardName} ${accountForSelect.cardDescription}`);
    expect(productBankType).toEqual(accountForSelect.productBankType);

    act(() => {
      fireEvent(
        screen.getByTestId('transfer-button'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
      );
    });

    const { approvalId, message, requestId, status } = store.getState().transferAccountState.transferResponse;
    expect(approvalId).toEqual(responseDoTransfer.approvalId);
    expect(message).toEqual(responseDoTransfer.message);
    expect(requestId).toEqual(responseDoTransfer.requestId);
    expect(status).toEqual(200);
    cleanup();
  });

  test('Should click tranfer button with error response 500', async () => {
    server.use(
      rest.post('/api-gateway/transfer-account/do-transfer', (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    store.dispatch(productsActions.fetchProductsSuccess(productsWithBalance));
    const accountForSelect = {
      cardDescription: 'No. 0019817386',
      cardName: 'Cuenta corrinte',
      productNumber: '0019817386',
      productBankType: 'DDA'
    };

    act(() => {
      render(<TransferAccount />);
    });

    const accountSelector: HTMLElement = (await waitFor(() =>
      screen.getByTestId('account-selector')
    )) as HTMLBdbMlCardPriceElement;

    act(() => {
      const clickForCard: Event & { detail?: unknown } = createEvent('cardSelected', accountSelector);
      clickForCard.detail = {
        ...accountForSelect
      };
      accountSelector.dispatchEvent(clickForCard);
      fireEvent(accountSelector, clickForCard);
    });

    const { description, productBankType } = store.getState().transferAccountState.accountTransfer.accountFrom;
    expect(description).toEqual(`${accountForSelect.cardName} ${accountForSelect.cardDescription}`);
    expect(productBankType).toEqual(accountForSelect.productBankType);

    act(() => {
      fireEvent(
        screen.getByTestId('transfer-button'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
      );
    });
    cleanup();
  });

  test('Should click tranfer button with error response 401', async () => {
    server.use(
      rest.post('/api-gateway/transfer-account/do-transfer', (_req, res, ctx) => {
        return res(ctx.status(401));
      })
    );
    store.dispatch(productsActions.fetchProductsSuccess(productsWithBalance));
    const accountForSelect = {
      cardDescription: 'No. 0019817386',
      cardName: 'Cuenta corrinte',
      productNumber: '0019817386',
      productBankType: 'DDA'
    };

    act(() => {
      render(<TransferAccount />);
    });

    const accountSelector: HTMLElement = (await waitFor(() =>
      screen.getByTestId('account-selector')
    )) as HTMLBdbMlCardPriceElement;

    act(() => {
      const clickForCard: Event & { detail?: unknown } = createEvent('cardSelected', accountSelector);
      clickForCard.detail = {
        ...accountForSelect
      };
      accountSelector.dispatchEvent(clickForCard);
      fireEvent(accountSelector, clickForCard);
    });

    const { description, productBankType } = store.getState().transferAccountState.accountTransfer.accountFrom;
    expect(description).toEqual(`${accountForSelect.cardName} ${accountForSelect.cardDescription}`);
    expect(productBankType).toEqual(accountForSelect.productBankType);

    act(() => {
      fireEvent(
        screen.getByTestId('transfer-button'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
      );
    });
    cleanup();
  });
});
