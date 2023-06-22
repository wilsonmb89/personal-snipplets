import { rest } from 'msw';
import React from 'react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { act, createEvent, fireEvent, render, screen, waitFor } from '../../../../test-utils/provider-mock';
import server, { getAffiliatedAcctsResponse, getProductsResponse } from '../../../../test-utils/api-mock';
import store from '../../../../store';
import BetweenAccountsList from './BetweenAccountsList';
import { BANK_INFO } from '../../../../constants/bank-codes';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

describe('Between account list', () => {
  const OLD_ENV = process.env;

  const target = {
    valuesCardList: [
      {
        title: 'Cuenta de Ahorros LibreAhorro',
        desc: BANK_INFO.BBOG.name,
        desc2: 'Ahorros No. 0019904804',
        value: '0019904804',
        icon: 'ico-saving',
        menu: [
          { icon: 'ico-transfer', label: 'Transferir', value: '0' },
          { icon: 'ico-time', label: 'Programar transferencia', value: '1' },
          { icon: 'ico-delete', label: 'Eliminar cuenta', value: '2' }
        ]
      }
    ]
  };

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterEach(() => {
    sessionStorage.clear();
    server.resetHandlers();
  });

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  const saveAccount = async () => {
    const cardList: HTMLElement = (await waitFor(() =>
      screen.getByTestId('affiliated-accounts')
    )) as HTMLBdbMlCardListElement;

    const clickOptionMenuEvent: Event & { detail?: { card?: unknown } } = createEvent('itemMenuClicked', cardList);

    Object.defineProperties(clickOptionMenuEvent, {
      detail: {
        value: {
          card: {
            value: '3108383838',
            avatar: {
              color: 'white',
              text: 'RA',
              size: 'sm'
            },
            desc: 'RAPPIPAY',
            bankId: '151',
            productType: 'CMA',
            desc2: 'Celular No. 3108383838'
          }
        }
      }
    });

    fireEvent(cardList, clickOptionMenuEvent);
    const clickForSave: Event & { detail?: unknown } = createEvent('itemClicked', cardList);
    clickForSave.detail = {
      value: '2',
      productType: '12',
      bankId: '0001',
      title: 'Cuenta de ahorros'
    };
    Object.defineProperties(clickForSave, {
      _target: {
        value: target,
        writable: true
      },
      target: {
        get: function () {
          return this._target;
        },
        set: function (value) {
          this._target = value;
        }
      }
    });
    cardList.dispatchEvent(clickForSave);
    fireEvent(cardList, clickForSave);
  };

  const clickOptionDelete = async () => {
    const modalsConfirmation = await screen.findAllByTestId('notification-modal');
    const modalConfirmation: HTMLBdbMlModalElement = modalsConfirmation[0] as HTMLBdbMlModalElement;
    const clickOptionEvent: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalConfirmation);
    clickOptionEvent.detail = {
      value: 'Si, eliminar'
    };
    modalConfirmation.dispatchEvent(clickOptionEvent);
    fireEvent(modalConfirmation, clickOptionEvent);
  };

  test('Should load the page', async () => {
    const betweenAccount = render(<BetweenAccountsList />);
    expect(betweenAccount).toBeTruthy();
  });

  test('show empty state for open account', async () => {
    server.use(rest.post('/api-gateway/products/get-all', (_req, res, ctx) => res(ctx.json({ accountList: [] }))));
    server.use(
      rest.post('/api-gateway/transfer-core/get-affiliated-accounts', (_req, res, ctx) =>
        res(ctx.json({ acctBalancesList: [] }))
      )
    );
    act(() => {
      render(<BetweenAccountsList />);
    });
    const emptyState: HTMLElement = await waitFor(() => screen.getByTestId('empty-state'));
    const openAccountButtton = await waitFor(() => screen.getByText('Abrir cuenta'));
    userEvent.click(openAccountButtton);
    expect(emptyState).toBeTruthy();
    expect(
      await screen.findByText('Para realizar transacciones, abre tu cuenta sin costo y lista para usar de inmediato.')
    ).toBeInTheDocument();
  });

  test('show empty state for inscribe account', async () => {
    server.use(
      rest.post('/api-gateway/products/get-all', (_req, res, ctx) =>
        res(ctx.json({ accountList: [getProductsResponse.accountList[0], getProductsResponse.accountList[1]] }))
      )
    );
    server.use(
      rest.post('/api-gateway/transfer-core/get-affiliated-accounts', (_req, res, ctx) =>
        res(ctx.json({ acctBalancesList: [] }))
      )
    );
    act(() => {
      render(<BetweenAccountsList />);
    });
    const emptyStateInscribe = await waitFor(() => screen.getByText('Inscribir cuenta'));
    userEvent.click(emptyStateInscribe);
  });

  test('show multiple own accounts and not inscribed accounts', async () => {
    server.use(
      rest.post('/api-gateway/products/get-all', (_req, res, ctx) =>
        res(ctx.json({ accountList: [getProductsResponse.accountList[0]] }))
      ),
      rest.post('/api-gateway/transfer-core/get-affiliated-accounts', (_req, res, ctx) =>
        res(ctx.json({ acctBalancesList: [] }))
      )
    );
    act(() => {
      render(<BetweenAccountsList />);
    });
    const emptyState: HTMLElement = await waitFor(() => screen.getByTestId('empty-state'), { timeout: 3000 });
    const emptyStateInscribe = await waitFor(() => screen.getByText('Inscribir cuenta'));
    userEvent.click(emptyStateInscribe);
    expect(emptyState).toBeTruthy();
  });

  test('show multiple own accounts and inscribed accounts', async () => {
    server.use(
      rest.post('/api-gateway/products/get-all', (_req, res, ctx) =>
        res(ctx.json({ accountList: [getProductsResponse.accountList[0]] }))
      ),
      rest.post('/api-gateway/transfer-core/get-affiliated-accounts', (_req, res, ctx) =>
        res(ctx.json({ acctBalancesList: [getAffiliatedAcctsResponse.acctBalancesList[0]] }))
      )
    );
    act(() => {
      render(<BetweenAccountsList />);
    });
    const emptyStateInscribe = await waitFor(() => screen.getByText('Inscribir cuenta'));
    userEvent.click(emptyStateInscribe);
  });

  test('should show affiliated account list no matter of balance service fail', async () => {
    server.use(
      rest.post('/api-gateway/products-detail/balances/batch-inquiry', (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    act(() => {
      render(<BetweenAccountsList />);
    });
    const accountListAffiliated: HTMLElement = await waitFor(() => screen.getByTestId('affiliated-accounts'));
    expect(accountListAffiliated).toBeTruthy();
  });

  test('should show retry component when service to affiliated fail', async () => {
    server.use(
      rest.post('/api-gateway/transfer-core/get-affiliated-accounts', (_req, res, ctx) => res(ctx.status(500)))
    );
    act(() => {
      render(<BetweenAccountsList />);
    });
    const retryComponente: HTMLElement = await waitFor(() => screen.getByTestId('retry-affiliated'));
    const clickOptionEvent: Event & { detail?: unknown } = createEvent('buttonClickedEvent', retryComponente);
    fireEvent(retryComponente, clickOptionEvent);
    expect(retryComponente).toBeTruthy();
  });

  test('should show retry component when both services fail', async () => {
    server.use(
      rest.post('/api-gateway/products/get-all', (_req, res, ctx) => res(ctx.status(500))),
      rest.post('/api-gateway/transfer-core/get-affiliated-accounts', (_req, res, ctx) => res(ctx.status(500)))
    );
    act(() => {
      render(<BetweenAccountsList />);
    });
    const emptyState: HTMLElement = await waitFor(() => screen.getByTestId('empty-state'), { timeout: 3000 });
    const emptyStateError = await waitFor(() => screen.getByText('Volver a cargar'));
    userEvent.click(emptyStateError);
    expect(emptyState).toBeTruthy();
    expect(emptyStateError).toBeTruthy();
  });

  test('should show retry component when service to products fail', async () => {
    server.use(
      rest.post('/api-gateway/products/get-all', (_req, res, ctx) => {
        return res(ctx.status(500));
      }),
      rest.post('/api-gateway/transfer-core/get-affiliated-accounts', (_req, res, ctx) =>
        res(ctx.json({ acctBalancesList: [getAffiliatedAcctsResponse.acctBalancesList[0]] }))
      )
    );
    act(() => {
      render(<BetweenAccountsList />);
    });
    const retryComponente: HTMLElement = await waitFor(() => screen.getByTestId('retry-ownaccounts'));
    const clickOptionEvent: Event & { detail?: unknown } = createEvent('buttonClickedEvent', retryComponente);
    fireEvent(retryComponente, clickOptionEvent);
    expect(retryComponente).toBeTruthy();
  });

  test('should click option save account', async () => {
    act(() => {
      render(<BetweenAccountsList />);
    });

    const cardList: HTMLElement = (await waitFor(() =>
      screen.getByTestId('affiliated-accounts')
    )) as HTMLBdbMlCardListElement;

    const clickOptionEvent: Event & { detail?: unknown } = createEvent('actionCardListEmitter', cardList);

    clickOptionEvent.detail = {
      value: '1',
      title: 'Cuenta de ahorros',
      icon: 'ico-saving',
      avatar: {
        text: '',
        color: ''
      },
      desc: 'DAVIVIENDA',
      desc2: 'description'
    };

    Object.defineProperties(clickOptionEvent, {
      _target: {
        value: target,
        writable: true
      },
      target: {
        get: function () {
          return this._target;
        },
        set: function (value) {
          this._target = value;
        }
      }
    });

    cardList.dispatchEvent(clickOptionEvent);
    fireEvent(cardList, clickOptionEvent);
    expect(cardList).toBeTruthy();
  });

  test('should click option delete account', async () => {
    act(() => {
      render(<BetweenAccountsList />);
    });

    const cardList: HTMLElement = (await waitFor(() =>
      screen.getByTestId('affiliated-accounts')
    )) as HTMLBdbMlCardListElement;

    const clickOptionMenuEvent: Event & { detail?: { card?: unknown } } = createEvent('itemMenuClicked', cardList);

    Object.defineProperties(clickOptionMenuEvent, {
      detail: {
        value: {
          card: {
            value: '3108383838',
            avatar: {
              color: 'white',
              text: 'RA',
              size: 'sm'
            },
            desc: 'RAPPIPAY',
            bankId: '151',
            productType: 'CMA',
            desc2: 'Celular No. 3108383838'
          }
        }
      }
    });

    fireEvent(cardList, clickOptionMenuEvent);

    const clickOptionEvent: Event & { detail?: unknown } = createEvent('itemClicked', cardList);

    clickOptionEvent.detail = {
      value: '2'
    };

    Object.defineProperties(clickOptionEvent, {
      _target: {
        value: target,
        writable: true
      },
      target: {
        get: function () {
          return this._target;
        },
        set: function (value) {
          this._target = value;
        }
      }
    });

    cardList.dispatchEvent(clickOptionEvent);
    fireEvent(cardList, clickOptionEvent);
    expect(cardList).toBeTruthy();
  });

  test('should click option redirect to scheduled transfer', async () => {
    act(() => {
      render(<BetweenAccountsList />);
    });

    const cardList: HTMLElement = (await waitFor(() =>
      screen.getByTestId('affiliated-accounts')
    )) as HTMLBdbMlCardListElement;

    const clickOptionMenuEvent: Event & { detail?: { card?: unknown } } = createEvent('itemMenuClicked', cardList);

    Object.defineProperties(clickOptionMenuEvent, {
      detail: {
        value: {
          card: {
            value: '6574839',
            avatar: {
              color: 'white',
              text: 'RA',
              size: 'sm'
            },
            desc: 'NEQUI',
            bankId: '507',
            productType: 'SDA',
            desc2: 'Ahorros No. 6574839'
          }
        }
      }
    });

    fireEvent(cardList, clickOptionMenuEvent);

    const clickOptionEvent: Event & { detail?: unknown } = createEvent('itemClicked', cardList);

    clickOptionEvent.detail = {
      value: '1'
    };

    cardList.dispatchEvent(clickOptionEvent);
    fireEvent(cardList, clickOptionEvent);
    expect(cardList).toBeTruthy();
  });

  test('should click confirm delete and receive error with scheduled and redirect', async () => {
    server.use(
      rest.post('/api-gateway/transfer-core/delete-account', (_req, res, ctx) => {
        return res(ctx.status(409));
      })
    );

    act(() => {
      render(<BetweenAccountsList />);
    });

    await clickOptionDelete();

    const modalScheduled: HTMLBdbMlModalElement = await screen.findByTestId('notification-modal');

    const clickOptionEventCancel: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalScheduled);
    clickOptionEventCancel.detail = {
      value: 'Ir a programaciones'
    };
    modalScheduled.dispatchEvent(clickOptionEventCancel);
    fireEvent(modalScheduled, clickOptionEventCancel);
    expect(modalScheduled).toBeTruthy();
  });

  test('should click confirm delete and receive error with scheduled and press cancel', async () => {
    server.use(
      rest.post('/api-gateway/transfer-core/delete-account', (_req, res, ctx) => {
        return res(ctx.status(409));
      })
    );

    act(() => {
      render(<BetweenAccountsList />);
    });

    await saveAccount();

    await clickOptionDelete();

    const modalScheduledError: HTMLBdbMlModalElement = await screen.findByTestId('notification-modal');

    const clickOptionEventCancel: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalScheduledError);
    clickOptionEventCancel.detail = {
      value: 'Cancelar'
    };
    modalScheduledError.dispatchEvent(clickOptionEventCancel);
    fireEvent(modalScheduledError, clickOptionEventCancel);
  });

  test('should click confirm delete and receive error', async () => {
    server.use(
      rest.post('/api-gateway/transfer-core/delete-account', (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    act(() => {
      render(<BetweenAccountsList />);
    });

    await saveAccount();

    await clickOptionDelete();

    const modalError: HTMLBdbMlModalElement = await screen.findByTestId('notification-modal');

    const clickOptionEventCancel: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalError);
    clickOptionEventCancel.detail = {
      value: 'Entendido'
    };
    modalError.dispatchEvent(clickOptionEventCancel);
    fireEvent(modalError, clickOptionEventCancel);
    expect(modalError).toBeTruthy();
  });

  test('should click option for transfer', async () => {
    act(() => {
      render(<BetweenAccountsList />);
    });

    const cardList: HTMLElement = (await waitFor(() =>
      screen.getByTestId('affiliated-accounts')
    )) as HTMLBdbMlCardListElement;

    const clickOptionEvent: Event & { detail?: unknown } = createEvent('itemClicked', cardList);

    clickOptionEvent.detail = {
      value: '0'
    };

    cardList.dispatchEvent(clickOptionEvent);
    expect(cardList).toBeTruthy();
  });

  test('should save account from option', async () => {
    act(() => {
      render(<BetweenAccountsList />);
    });

    const card = {
      value: '123456789',
      icon: 'icon-saving',
      desc2: 'Ahorros No. 123456789',
      desc: BANK_INFO.BBOG.name,
      title: 'Cuenta de ahorros'
    };

    const cardList: HTMLElement = (await waitFor(() =>
      screen.getByTestId('affiliated-accounts')
    )) as HTMLBdbMlCardListElement;

    const clickOptionEvent: Event & { detail?: { card?: unknown } } = createEvent('itemMenuClicked', cardList);

    clickOptionEvent.detail = {
      card
    };

    fireEvent(cardList, clickOptionEvent);
    const { icon, description, productBankName, title } =
      store.getState().transferAccountState.accountTransfer.accountTo;
    expect(cardList).toBeTruthy();
    expect(card.icon).toEqual(icon);
    expect(card.desc2).toEqual(description);
    expect(card.desc).toEqual(productBankName);
    expect(card.title).toEqual(title);
  });
});
