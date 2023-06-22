import { rest } from 'msw';
import React from 'react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { act, createEvent, fireEvent, render, screen, waitFor } from '../../../../test-utils/provider-mock';
import server, { getAffiliatedAcctsResponse, getProductsResponse } from '../../../../test-utils/api-mock';
import ScheduledTransferList from './ScheduledTransferList';
import store from '../../../../store';
import { scheduledTransferListActions } from '../../store/list/scheduled-transfer-list.reducer';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

describe('Scheduled Transfer List Page', () => {
  const OLD_ENV = process.env;

  const target = {
    valuesCardList: [
      {
        id: '2fc0e70b-468e-4523-afde-bbd928f40fb6',
        accountFromId: '0019817337',
        accountToId: '0019904804',
        desc: 'Desde: Ahorros No. 0019817337',
        icon: 'ico-saving',
        title: 'Arriendo',
        transfersRemaining: '0 restantes',
        values: [
          {
            amount: '1.234',
            label: 'Valor',
            isAmount: true
          },
          {
            amount: '22 Nov 2022',
            label: 'Próxima'
          }
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

  test('Should load the page', async () => {
    const scheduledTransferList = render(<ScheduledTransferList />);
    expect(scheduledTransferList).toBeTruthy();
  });

  test('should list successfully scheduled transfers', async () => {
    const mockState = jest.spyOn(React, 'useEffect');

    act(() => {
      render(<ScheduledTransferList />);
    });
    const cardList: HTMLElement = (await waitFor(() =>
      screen.getByTestId('scheduled-transfer-list')
    )) as HTMLBdbMlCardListElement;

    const clickOptionEvent: Event & { detail?: unknown } = createEvent('actionCardListEmitter', cardList);

    clickOptionEvent.detail = {
      id: '427',
      accountToId: '234567',
      accountFromId: '0019817337',
      transfersRemaining: '0 restantes',
      icon: 'ico-saving',
      title: 'Caso Final de mes',
      desc: 'Desde: Ahorros No. 180577926',
      values: [
        { label: 'Valor', amount: '4.444', isAmount: true },
        { label: 'Próxima', amount: '30 Jun 2021' }
      ]
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

    expect(mockState).toHaveBeenCalled();
    expect(cardList).toBeTruthy();
    expect(await screen.findByText('A cuentas bancarias')).toBeInTheDocument();
  });

  test('should show empty status when you have no accounts', async () => {
    server.use(rest.post('/api-gateway/products/get-all', (_req, res, ctx) => res(ctx.json({ accountList: [] }))));
    act(() => {
      render(<ScheduledTransferList />);
    });
    const emptyState: HTMLElement = await waitFor(() => screen.getByTestId('empty-state'));
    const emptyStateButton = await waitFor(() => screen.getByText('Abrir cuenta'));
    userEvent.click(emptyStateButton);
    expect(emptyState).toBeTruthy();
  });

  test('should show empty status when you have no affiliated accounts', async () => {
    server.use(
      rest.post('/api-gateway/products/get-all', (_req, res, ctx) =>
        res(ctx.json({ accountList: [getProductsResponse.accountList[0]] }))
      ),
      rest.post('/api-gateway/transfer-core/get-affiliated-accounts', (_req, res, ctx) =>
        res(ctx.json({ acctBalancesList: [] }))
      )
    );
    act(() => {
      render(<ScheduledTransferList />);
    });
    const emptyState: HTMLElement = await waitFor(() => screen.getByTestId('empty-state'), { timeout: 3000 });
    const emptyStateLink = await waitFor(() => screen.getByText('Entre Cuentas'));
    userEvent.click(emptyStateLink);
    expect(emptyState).toBeTruthy();
  });

  test('should show an empty state when there are no scheduled transfers', async () => {
    server.use(
      rest.post('/api-gateway/transfer-account/scheduled', (_req, res, ctx) =>
        res(ctx.json({ scheduleTransfersResponseList: [] }))
      )
    );
    act(() => {
      render(<ScheduledTransferList />);
    });
    const emptyState: HTMLElement = await waitFor(() => screen.getByTestId('empty-state'));
    const emptyStateButton = await waitFor(() => screen.getByText('Nueva programación'));
    userEvent.click(emptyStateButton);
    expect(emptyState).toBeTruthy();
  });

  test('should show empty status when service to scheduled fail', async () => {
    server.use(
      rest.post('/api-gateway/transfer-account/scheduled', (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    act(() => {
      render(<ScheduledTransferList />);
    });
    const emptyState: HTMLElement = await waitFor(() => screen.getByTestId('empty-state'));
    const emptyStateButton = await waitFor(() => screen.getByText('Volver a cargar'));
    userEvent.click(emptyStateButton);
    expect(emptyState).toBeTruthy();
    expect(await screen.findByText('Hubo un error al cargar tus programaciones.')).toBeInTheDocument();
  });

  test('Should show Add Scheduled Transfer button', async () => {
    const mockState = jest.spyOn(React, 'useEffect');
    act(() => {
      render(<ScheduledTransferList />);
    });
    await waitFor(() => screen.getByTestId('scheduled-transfer-list'));
    const addScheduledTransferButton = await waitFor(() => screen.getByTestId('add-scheduled-transfer-btn'));
    expect(addScheduledTransferButton).toBeInTheDocument();
    userEvent.click(addScheduledTransferButton);
    expect(mockState).toHaveBeenCalled();
  });

  // ToDo: temporary test while enrolling accounts are deleted
  test('should show modal if you dont have registered account and delete', async () => {
    const mockState = jest.spyOn(React, 'useEffect');

    act(() => {
      render(<ScheduledTransferList />);
    });
    const cardList: HTMLElement = (await waitFor(() =>
      screen.getByTestId('scheduled-transfer-list')
    )) as HTMLBdbMlCardListElement;

    const clickOptionEvent: Event & { detail?: unknown } = createEvent('actionCardListEmitter', cardList);

    clickOptionEvent.detail = {
      id: '427',
      accountToId: '9999999',
      accountFromId: '0019817337',
      transfersRemaining: '0 restantes',
      icon: 'ico-saving',
      title: 'Caso Final de mes',
      desc: 'Desde: Ahorros No. 180577926',
      values: [
        { label: 'Valor', amount: '4.444', isAmount: true },
        { label: 'Próxima', amount: '30 Jun 2021' }
      ]
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

    const modalConfirmation: HTMLElement = await waitFor(() => screen.getByTestId('notification-modal'));

    const clickOptionEventModal: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalConfirmation);
    clickOptionEventModal.detail = { value: 'Eliminar la programación' };

    modalConfirmation.dispatchEvent(clickOptionEventModal);
    fireEvent(modalConfirmation, clickOptionEventModal);
    expect(modalConfirmation).toBeTruthy();

    expect(mockState).toHaveBeenCalled();
    expect(cardList).toBeTruthy();
  });

  // ToDo: temporary test while enrolling accounts are deleted
  test('should show modal if you dont have a registered account and return', async () => {
    const mockState = jest.spyOn(React, 'useEffect');
    act(() => {
      render(<ScheduledTransferList />);
    });
    const cardList: HTMLElement = (await waitFor(() =>
      screen.getByTestId('scheduled-transfer-list')
    )) as HTMLBdbMlCardListElement;

    const clickOptionEvent: Event & { detail?: unknown } = createEvent('actionCardListEmitter', cardList);

    clickOptionEvent.detail = {
      id: '427',
      accountToId: '9999999',
      accountFromId: '0019817337',
      transfersRemaining: '0 restantes',
      icon: 'ico-saving',
      title: 'Caso Final de mes',
      desc: 'Desde: Ahorros No. 180577926',
      values: [
        { label: 'Valor', amount: '4.444', isAmount: true },
        { label: 'Próxima', amount: '30 Jun 2021' }
      ]
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

    const modalConfirmation: HTMLElement = await waitFor(() => screen.getByTestId('notification-modal'));

    const clickOptionEventModal: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalConfirmation);
    clickOptionEventModal.detail = { value: 'Volver' };

    modalConfirmation.dispatchEvent(clickOptionEventModal);
    fireEvent(modalConfirmation, clickOptionEventModal);
    expect(modalConfirmation).toBeTruthy();
    expect(mockState).toHaveBeenCalled();
    expect(cardList).toBeTruthy();
  });

  test('should not call ScheduledTransfer service', async () => {
    store.dispatch(
      scheduledTransferListActions.addScheduledTransfer({
        destinationAccountHolderIdType: 'CC',
        destinationAccountHolderIdNumber: '2006701',
        amount: 4444.02,
        scheduleId: '436',
        nextExecutionDate: '2021-11-29T05:00:00.000Z',
        scheduledCount: 9,
        pendingCount: 5,
        description: 'Test desc',
        frequency: 'DAILY',
        accountFrom: {
          acctId: '0019904804',
          acctType: 'SDA',
          bankId: '3',
          bankName: 'BANCO DE BOGOTA'
        },
        accountTo: {
          acctId: '569302',
          acctType: 'SDA',
          bankId: '15',
          bankName: 'BBVA COLOMBIA'
        },
        status: 'PENDING',
        recurrent: true
      })
    );
    server.use(
      rest.post('/api-gateway/transfer-core/get-affiliated-accounts', (_req, res, ctx) =>
        res(ctx.json(getAffiliatedAcctsResponse))
      )
    );
    const mockState = jest.spyOn(React, 'useEffect');
    let scheduledTransferList;
    act(() => {
      scheduledTransferList = render(<ScheduledTransferList />);
    });
    expect(mockState).toHaveBeenCalled();
    expect(scheduledTransferList).toBeTruthy();
  });
});
