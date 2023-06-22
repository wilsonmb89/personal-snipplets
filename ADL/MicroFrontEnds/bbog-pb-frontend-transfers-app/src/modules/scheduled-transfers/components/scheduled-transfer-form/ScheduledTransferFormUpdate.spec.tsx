import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, waitFor, screen, createEvent } from '../../../../test-utils/provider-mock';
import { targetAccountActions } from '../../store/targetAccount/target-account.reducer';
import store from '../../../../store';
import server, { modifyScheduledRequest } from '../../../../test-utils/api-mock';
import { axiosADLInstance } from '@utils/constants';
import ScheduledTransferCreate from '../../pages/scheduled-transfer-create/ScheduledTransferCreate';
import { scheduledTransferSelectedActions } from '../../store/selected/scheduled-transfer-selected.reducer';
import ScheduledTransferForm from './ScheduledTransferForm';
import { rest } from 'msw';

jest.mock('react-router', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/programadas/editar'
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

describe('ScheduledTransfer Update', () => {
  const handlerErrorMock = () => jest.fn();
  const OLD_ENV = process.env;
  const postSpy = jest.spyOn(axiosADLInstance, 'post');

  const dispatchScheduledSelected = (frequency = 'DAILY') => {
    store.dispatch(
      scheduledTransferSelectedActions.setScheduledTransferSelected({
        destinationAccountHolderIdType: 'CC',
        destinationAccountHolderIdNumber: '2006701',
        amount: 4444.02,
        scheduleId: '436',
        description: 'Test desc',
        frequency,
        nextExecutionDate: '2021-11-29T05:00:00.000Z',
        scheduledCount: 9,
        pendingCount: 5,
        recurrent: true,
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
        status: 'PENDING'
      })
    );
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
    datePickerEvent.detail = [new Date('2021/11/29')];
    datePicker.dispatchEvent(datePickerEvent);
  };

  const submitButtonAction = async () => {
    const button = screen.getByText('Modificar');
    await waitFor(() => fireEvent.submit(button), { timeout: 100 });
  };

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch({ type: 'UNMOUNT' });
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

  test('should render ScheduledTransferForm component to Update', () => {
    const scheduledTransferForm = render(<ScheduledTransferForm isUpdate={true} onError={handlerErrorMock} />);
    expect(scheduledTransferForm).toBeTruthy();
  });

  test('should modify a daily scheduled transfer', async () => {
    dispatchScheduledSelected();
    render(<ScheduledTransferCreate />);
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Solo una vez', 'ONLY_ONCE');
    await setNextExecutionDate();
    await submitButtonAction();
    expect(postSpy.mock.calls[3]).toEqual([
      'transfer-account/modify-scheduled',
      { ...modifyScheduledRequest, nextExecutionDate: '2021-11-29' }
    ]);
  });

  test('should modify a weekly scheduled transfer', async () => {
    dispatchScheduledSelected('WEEKLY');
    render(<ScheduledTransferCreate />);
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Solo una vez', 'ONLY_ONCE');
    await setNextExecutionDate();
    await submitButtonAction();
    expect(postSpy.mock.calls[3]).toEqual([
      'transfer-account/modify-scheduled',
      { ...modifyScheduledRequest, nextExecutionDate: '2021-11-29' }
    ]);
  });

  test('should modify a biweekly scheduled transfer', async () => {
    dispatchScheduledSelected('BIWEEKLY');
    render(<ScheduledTransferCreate />);
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Solo una vez', 'ONLY_ONCE');
    await setNextExecutionDate();
    await submitButtonAction();
    expect(postSpy.mock.calls[3]).toEqual([
      'transfer-account/modify-scheduled',
      { ...modifyScheduledRequest, nextExecutionDate: '2021-11-29' }
    ]);
  });

  test('should modify a monthly or endofmonth scheduled transfer', async () => {
    dispatchScheduledSelected('MONTHLY');
    render(<ScheduledTransferCreate />);
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Solo una vez', 'ONLY_ONCE');
    await setNextExecutionDate();
    await submitButtonAction();
    expect(postSpy.mock.calls[3]).toEqual([
      'transfer-account/modify-scheduled',
      { ...modifyScheduledRequest, nextExecutionDate: '2021-11-29' }
    ]);
  });

  test('should modify a twicemonthly scheduled transfer', async () => {
    dispatchScheduledSelected('TWICEMONTHLY');
    render(<ScheduledTransferCreate />);
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Solo una vez', 'ONLY_ONCE');
    await setNextExecutionDate();
    await submitButtonAction();
    expect(postSpy.mock.calls[3]).toEqual([
      'transfer-account/modify-scheduled',
      { ...modifyScheduledRequest, nextExecutionDate: '2021-11-29' }
    ]);
  });

  test('should modify a quarterly scheduled transfer', async () => {
    dispatchScheduledSelected('QUARTERLY');
    render(<ScheduledTransferCreate />);
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Solo una vez', 'ONLY_ONCE');
    await setNextExecutionDate();
    await submitButtonAction();
    expect(postSpy.mock.calls[3]).toEqual([
      'transfer-account/modify-scheduled',
      { ...modifyScheduledRequest, nextExecutionDate: '2021-11-29' }
    ]);
  });

  test('should modify a annually scheduled transfer', async () => {
    dispatchScheduledSelected('ANNUALLY');
    render(<ScheduledTransferCreate />);
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Solo una vez', 'ONLY_ONCE');
    await setNextExecutionDate();
    await submitButtonAction();
    expect(postSpy.mock.calls[3]).toEqual([
      'transfer-account/modify-scheduled',
      { ...modifyScheduledRequest, nextExecutionDate: '2021-11-29' }
    ]);
  });

  test('should show modal', async () => {
    window.history.pushState({}, 'Scheduled Transfer Create', '/transfers/create-scheduled-transfer/update');
    render(<ScheduledTransferCreate />);
    const bodyResponse = { status: 500 };
    server.use(
      rest.post('/api-gateway/transfer-account/delete-scheduled', (_req, res, ctx) =>
        res(ctx.status(500), ctx.body(JSON.stringify(bodyResponse)))
      )
    );
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    dispatchScheduledSelected();
    const button = screen.getByText('Eliminar programación');
    await waitFor(() => fireEvent.click(button));
    const errorModal = (await waitFor(() => screen.getByTestId('notification-modal'))) as HTMLBdbMlModalElement;
    expect(errorModal.titleModal).toEqual('Eliminar programación');
    const clickOptionEvent: Event & { detail?: unknown } = createEvent('buttonAlertClicked', errorModal);
    clickOptionEvent.detail = { value: 'Si, eliminar' };
    errorModal.dispatchEvent(clickOptionEvent);
    await new Promise(r => setTimeout(r, 500));
    expect(errorModal).not.toBeInTheDocument();
    expect(postSpy.mock.calls[3]).toEqual(['transfer-account/delete-scheduled', { scheduledId: '436' }]);
  });

  test('should quit when updating', async () => {
    window.history.pushState({}, 'Scheduled Transfer Create', '/transfers/create-scheduled-transfer/update');
    render(<ScheduledTransferCreate />);
    jest.spyOn(URLSearchParams.prototype, 'get').mockImplementation(key => key);

    const header: HTMLElement = await waitFor(() => screen.getByTestId('header'));
    const clickOptionEventHeader: Event & { detail?: unknown } = createEvent('backBtnClicked', header);
    clickOptionEventHeader.detail = { value: 'Cerrar' };
    header.dispatchEvent(clickOptionEventHeader);
    fireEvent(header, clickOptionEventHeader);

    const modalConfirmation: HTMLElement = await waitFor(() => screen.getByTestId('notification-modal'));
    const clickOptionEventModal: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalConfirmation);
    clickOptionEventModal.detail = { value: 'Sí, abandonar' };
    modalConfirmation.dispatchEvent(clickOptionEventModal);
    fireEvent(modalConfirmation, clickOptionEventModal);

    expect(header).toBeTruthy();
    expect(modalConfirmation).toBeTruthy();
  });

  test('should modify a quarterly scheduled transfer with indefinite repeat', async () => {
    const mockSetState = jest.spyOn(React, 'useState');
    dispatchScheduledSelected('QUARTERLY');
    render(<ScheduledTransferCreate />);
    await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    const indefiniteCheck = (await waitFor(() => screen.getByTestId('indefinite'))) as HTMLBdbAtCheckButtonElement;
    const checkEvent: Event & { detail?: unknown } = createEvent('checkEmitter', indefiniteCheck);
    checkEvent.detail = [{ label: 'Repetir transferencia indefinidamente', value: 'true', isChecked: 'true' }];
    indefiniteCheck.dispatchEvent(checkEvent);
    await setNextExecutionDate();
    await submitButtonAction();
    expect(mockSetState).toHaveBeenCalled();
  });

  test('should send the form answering error due to duplicity', async () => {
    dispatchScheduledSelected('MONTHLY');
    render(<ScheduledTransferCreate />);
    const bodyResponse = { status: 409, data: { businessErrorCode: '65' } };
    server.use(
      rest.post('/api-gateway/transfer-account/modify-scheduled', (_req, res, ctx) =>
        res(ctx.status(409), ctx.body(JSON.stringify(bodyResponse)))
      )
    );
    const form = await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Solo una vez', 'ONLY_ONCE');
    await setNextExecutionDate();
    await submitButtonAction();
    expect(form).toBeTruthy();
  });

  test('should send form with error udentified', async () => {
    dispatchScheduledSelected('MONTHLY');
    render(<ScheduledTransferCreate />);
    const bodyResponse = { status: 500 };
    server.use(
      rest.post('/api-gateway/transfer-account/modify-scheduled', (_req, res, ctx) =>
        res(ctx.status(500), ctx.body(JSON.stringify(bodyResponse)))
      )
    );
    const form = await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Solo una vez', 'ONLY_ONCE');
    await setNextExecutionDate();
    await submitButtonAction();
    expect(form).toBeTruthy();
  });

  test('should send form with error udentified and scheduled weekly', async () => {
    dispatchScheduledSelected('WEEKLY');
    render(<ScheduledTransferCreate />);
    const bodyResponse = { status: 500 };
    server.use(
      rest.post('/api-gateway/transfer-account/modify-scheduled', (_req, res, ctx) =>
        res(ctx.status(500), ctx.body(JSON.stringify(bodyResponse)))
      )
    );
    const form = await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    setFrecuency('Diario', 'DAILY');
    await setNextExecutionDate();
    await submitButtonAction();
    expect(form).toBeTruthy();
  });

  test('should send form with business error different', async () => {
    dispatchScheduledSelected('MONTHLY');
    render(<ScheduledTransferCreate />);
    const bodyResponse = { status: 409, data: { businessErrorCode: '122' } };
    server.use(
      rest.post('/api-gateway/transfer-account/modify-scheduled', (_req, res, ctx) =>
        res(ctx.status(409), ctx.body(JSON.stringify(bodyResponse)))
      )
    );
    const form = await waitFor(() => screen.getByTestId('scheduled-transfer-form'));
    await setFrecuency('Solo una vez', 'ONLY_ONCE');
    await setNextExecutionDate();
    await submitButtonAction();
    expect(form).toBeTruthy();
  });
});
