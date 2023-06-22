import React from 'react';
import { rest } from 'msw';
import '@testing-library/jest-dom';
import { fireEvent, render, waitFor, screen, createEvent } from '../../../../test-utils/provider-mock';
import { targetAccountActions } from '../../store/targetAccount/target-account.reducer';
import store from '../../../../store';
import server, { createScheduledRequest, getProductsResponse } from '../../../../test-utils/api-mock';
import { axiosADLInstance } from '@utils/constants';
import { sherpaEvent, sherpaEventDatePickers } from '../../../../test-utils/sherpa-event';
import ScheduledTransferCreate from '../../pages/scheduled-transfer-create/ScheduledTransferCreate';
import ScheduledTransferForm from './ScheduledTransferForm';
import { fetchProducts } from '../../../../store/products/products.effect';
import { INDEFINITE_TRANSFER_COUNT, TRANSFER_COUNT_TYPE } from '../../constants/schedule-transfers';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/programadas/crear'
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

describe('ScheduledTransferCreate', () => {
  const handlerErrorMock = () => jest.fn();
  const OLD_ENV = process.env;
  const postSpy = jest.spyOn(axiosADLInstance, 'post');

  const fillCommonInputs = () => {
    const description = screen.getByTestId('description') as HTMLBdbAtInputElement;
    sherpaEvent.type(description, { value: 'Netflix' });

    const amount = screen.getByTestId('amount') as HTMLBdbAtInputElement;
    sherpaEvent.type(amount, { value: '123456' });

    const accountDropdown = screen.getByTestId('account') as HTMLBdbAtDropdownElement;
    const accountEvent: Event & { detail?: unknown } = createEvent('elementSelectedAtom', accountDropdown);
    accountEvent.detail = { text: 'Cuenta de Ahorros LibreAhorro No. 0019904804', value: '0019904804_SDA' };
    accountDropdown.dispatchEvent(accountEvent);

    const count = screen.getByTestId('count') as HTMLBdbAtInputElement;
    sherpaEvent.type(count, { value: '15' });

    const calendar = screen.getByTestId('calendar') as HTMLBdbMlDatePickerElement;
    sherpaEventDatePickers.type(calendar, [new Date(2022, 0, 1)]);
  };

  const setFrecuency = async (text: string, value: string) => {
    const frecuencyDropdown = (await waitFor(() => screen.getByTestId('frequency'))) as HTMLBdbAtDropdownElement;
    const frecuencyEvent: Event & { detail?: unknown } = createEvent('elementSelectedAtom', frecuencyDropdown);
    frecuencyEvent.detail = { text, value };
    frecuencyDropdown.dispatchEvent(frecuencyEvent);
  };

  const setNextExecutionDate = async (): Promise<void> => {
    const datePicker = await waitFor(() => screen.getByTestId('calendar') as HTMLBdbMlDatePickerElement);
    const datePickerEvent: Event & { detail?: unknown } = createEvent('datePickerChange', datePicker);
    datePickerEvent.detail = [new Date('2022/01/01')];
    datePicker.dispatchEvent(datePickerEvent);
  };

  const setNextExecutionDateInvalid = async (): Promise<void> => {
    const datePicker = await waitFor(() => screen.getByTestId('calendar') as HTMLBdbMlDatePickerElement);
    const datePickerEvent: Event & { detail?: unknown } = createEvent('datePickerChange', datePicker);
    datePickerEvent.detail = [null];
    datePicker.dispatchEvent(datePickerEvent);
  };

  const submitButtonAction = async () => {
    const button = screen.getByText('Programar');
    await waitFor(() => fireEvent.submit(button), { timeout: 100 });
  };

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch({ type: 'UNMOUNT' });
    render(<ScheduledTransferCreate />);
    store.dispatch(
      targetAccountActions.setTargetAccount({
        accountAlias: 'Mama',
        accountType: 'SDA',
        accountId: '12345678',
        bankId: '1001',
        bankName: 'Banco de Bogota',
        isAval: true
      })
    );
  });

  afterEach(() => {
    sessionStorage.clear();
    server.resetHandlers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  test('should render ScheduledTransferForm component', () => {
    const scheduledTransferForm = render(<ScheduledTransferForm isUpdate={false} onError={handlerErrorMock} />);
    expect(scheduledTransferForm).toBeTruthy();
  });

  test('should get catalogs', () => {
    expect(postSpy.mock.calls[0]).toEqual([
      'user-features/get-catalog',
      { catalogName: 'SCHEDULED_TRANSFERS_FREQUENCY' }
    ]);
  });

  test('should validate only once frecuency', async () => {
    const mockSetState = jest.spyOn(React, 'useState');
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    const frecuencyDropdown = (await waitFor(() => screen.getByTestId('frequency'))) as HTMLBdbAtDropdownElement;
    const selectEvent: Event & { detail?: unknown } = createEvent('elementSelectedAtom', frecuencyDropdown);
    selectEvent.detail = { text: 'Solo una vez', value: 'ONLY_ONCE' };
    frecuencyDropdown.dispatchEvent(selectEvent);
    expect(mockSetState).toHaveBeenCalled();
  });

  test('should validate checkbox', async () => {
    const mockSetState = jest.spyOn(React, 'useState');
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    const indefiniteCheck = (await waitFor(() => screen.getByTestId('indefinite'))) as HTMLBdbAtCheckButtonElement;
    const checkEvent: Event & { detail?: unknown } = createEvent('checkEmitter', indefiniteCheck);
    checkEvent.detail = [{ label: 'Repetir transferencia indefinidamente', value: 'true', isChecked: 'true' }];
    indefiniteCheck.dispatchEvent(checkEvent);
    expect(mockSetState).toHaveBeenCalled();
  });

  test('should send form only_once', async () => {
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Solo una vez', 'ONLY_ONCE');
    fillCommonInputs();
    await submitButtonAction();
    expect(postSpy.mock.calls[3]).toEqual(['transfer-account/add-scheduled', createScheduledRequest]);
  });

  test('should send form daily indefinite scheduled transfer', async () => {
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Diario', 'DAILY');
    fillCommonInputs();

    const indefiniteCheck = (await waitFor(() => screen.getByTestId('indefinite'))) as HTMLBdbAtCheckButtonElement;
    const checkEvent: Event & { detail?: unknown } = createEvent('checkEmitter', indefiniteCheck);
    checkEvent.detail = [{ label: 'Repetir transferencia indefinidamente', value: 'true', isChecked: 'true' }];
    indefiniteCheck.dispatchEvent(checkEvent);
    await setNextExecutionDate();

    await submitButtonAction();
    expect(postSpy.mock.calls[3]).toEqual([
      'transfer-account/add-scheduled',
      {
        ...createScheduledRequest,
        frequency: 'DAILY',
        countType: TRANSFER_COUNT_TYPE.REPEAT_EVER,
        count: INDEFINITE_TRANSFER_COUNT
      }
    ]);
  });

  test('should disable button for calendar validation', async () => {
    const mockSetState = jest.spyOn(React, 'useState');
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Diario', 'DAILY');
    fillCommonInputs();
    const indefiniteCheck = (await waitFor(() => screen.getByTestId('indefinite'))) as HTMLBdbAtCheckButtonElement;
    const checkEvent: Event & { detail?: unknown } = createEvent('checkEmitter', indefiniteCheck);
    checkEvent.detail = [{ label: 'Repetir transferencia indefinidamente', value: 'true', isChecked: 'true' }];
    indefiniteCheck.dispatchEvent(checkEvent);
    await setNextExecutionDateInvalid();
    expect(mockSetState).toHaveBeenCalled();
  });

  test('should change text for description', async () => {
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Diario', 'DAILY');
    fillCommonInputs();
    const description = (await waitFor(() => screen.getByTestId('description'))) as HTMLBdbAtCheckButtonElement;
    const descriptionEventUpdate: Event & { detail?: unknown } = createEvent('atInputUpdated', description);
    Object.defineProperties(descriptionEventUpdate, {
      _target: {
        value: {
          currentTarget: {
            value: 'test'
          }
        },
        writable: true
      }
    });
    description.dispatchEvent(descriptionEventUpdate);
    expect(description).toBeTruthy();
  });

  test('should send form weekly', async () => {
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Semanalmente', 'WEEKLY');
    fillCommonInputs();

    await submitButtonAction();
    expect(postSpy.mock.calls[3]).toEqual([
      'transfer-account/add-scheduled',
      { ...createScheduledRequest, frequency: 'WEEKLY' }
    ]);
  });

  test('should send form biweekly', async () => {
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Cada dos semanas', 'BIWEEKLY');
    fillCommonInputs();

    await submitButtonAction();
    expect(postSpy.mock.calls[3]).toEqual([
      'transfer-account/add-scheduled',
      { ...createScheduledRequest, frequency: 'BIWEEKLY' }
    ]);
  });

  test('should send form monthly', async () => {
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Cada mes', 'MONTHLY');
    fillCommonInputs();

    await submitButtonAction();
    expect(postSpy.mock.calls[3]).toEqual([
      'transfer-account/add-scheduled',
      { ...createScheduledRequest, frequency: 'MONTHLY' }
    ]);
  });

  test('should send form twicemonthly', async () => {
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Cada dos meses', 'TWICEMONTHLY');
    fillCommonInputs();

    await submitButtonAction();
    expect(postSpy.mock.calls[3]).toEqual([
      'transfer-account/add-scheduled',
      { ...createScheduledRequest, frequency: 'TWICEMONTHLY' }
    ]);
  });

  test('should send form quarterly', async () => {
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Cada seis meses', 'QUARTERLY');
    fillCommonInputs();

    await submitButtonAction();
    expect(postSpy.mock.calls[3]).toEqual([
      'transfer-account/add-scheduled',
      { ...createScheduledRequest, frequency: 'QUARTERLY' }
    ]);
  });

  test('should send form annually', async () => {
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Cada año', 'ANNUALLY');
    fillCommonInputs();

    await submitButtonAction();
    expect(postSpy.mock.calls[3]).toEqual([
      'transfer-account/add-scheduled',
      { ...createScheduledRequest, frequency: 'ANNUALLY' }
    ]);
  });

  test('should get modal error by catalogs error', async () => {
    const bodyResponse = { status: 500 };
    server.use(
      rest.post('/api-gateway/user-features/get-catalog', (_req, res, ctx) => {
        return res(ctx.status(500), ctx.body(JSON.stringify(bodyResponse)));
      })
    );
    render(<ScheduledTransferCreate />);
    const errorModal = await waitFor(() => screen.getByTestId('notification-modal'));
    expect(errorModal).toBeInTheDocument();
  });

  test('should autoselect product if client has only one account', async () => {
    const monoAccountResponse = { accountList: [getProductsResponse.accountList[0]] };
    server.use(rest.post('/api-gateway/products/get-all', (req, res, ctx) => res(ctx.json(monoAccountResponse))));

    await store.dispatch(fetchProducts());
    render(<ScheduledTransferCreate />);
    const accounts = await screen.findAllByTestId('account');
    const defaultAccountValue = (accounts[0] as HTMLBdbAtDropdownElement).defaultvalue;
    expect(defaultAccountValue).toBe('0019904804_SDA');
  });

  test('should send form with error unidentified', async () => {
    const mockSetState = jest.spyOn(React, 'useState');
    server.use(rest.post('/api-gateway/transfer-account/add-scheduled', (_req, res, ctx) => res(ctx.status(500))));
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Solo una vez', 'ONLY_ONCE');
    fillCommonInputs();
    await submitButtonAction();
    expect(mockSetState).toHaveBeenCalled();
  });

  test('should send form with business error', async () => {
    const bodyResponse = { status: 409, data: { businessErrorCode: '65' } };
    server.use(
      rest.post('/api-gateway/transfer-account/add-scheduled', (_req, res, ctx) =>
        res(ctx.status(409), ctx.body(JSON.stringify(bodyResponse)))
      )
    );
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Solo una vez', 'ONLY_ONCE');
    fillCommonInputs();
    await submitButtonAction();
    const errorModal = await waitFor(() => screen.getByTestId('notification-modal'));
    expect(errorModal).toBeInTheDocument();
  });

  test('should send form with business error different duplicate', async () => {
    const bodyResponse = { status: 409, data: { businessErrorCode: '61' } };
    server.use(
      rest.post('/api-gateway/transfer-account/add-scheduled', (_req, res, ctx) =>
        res(ctx.status(409), ctx.body(JSON.stringify(bodyResponse)))
      )
    );
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Solo una vez', 'ONLY_ONCE');
    fillCommonInputs();
    await submitButtonAction();
    const errorModal = await waitFor(() => screen.getByTestId('notification-modal'));
    expect(errorModal).toBeInTheDocument();
  });
});
