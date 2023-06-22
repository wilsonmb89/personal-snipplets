import React from 'react';
import EnrollAccount from '../../pages/enroll-account/EnrollAccount';
import EnrollHolderForm from './EnrollHolderForm';
import store from '../../../../store';
import { AffiliatedAccount } from '../../../../store/affiliated-accounts/afilliated-accounts.entity';
import { BetweenAccountPaths } from '../../constants/navigation-paths';
import { BANK_INFO, ProductTypes } from '../../../../constants/bank-codes';
import { Documents, DocumentsName } from '../../../../constants/document';
import { Provider } from 'react-redux';
import { createEvent, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { sherpaEvent } from '../../../../test-utils/sherpa-event';
import server from '../../../../test-utils/api-mock';
import { rest } from 'msw';
import { axiosADLInstance } from '@utils/constants';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: BetweenAccountPaths.ENROLL_ACCOUNT_HOLDER
  })
}));

jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux
  };
});

axiosADLInstance.interceptors.response.use(
  successRes => {
    return successRes;
  },
  error => {
    return Promise.reject(error.response);
  }
);

describe('Enroll holder form component', () => {
  const setDataHolderForm = jest.fn();
  const setShowBackdrop = jest.fn();
  const OLD_ENV = process.env;

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
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  const dataAccountForm: Partial<AffiliatedAccount> = {
    productBank: BANK_INFO.BBOG.name,
    productType: ProductTypes.SAVINGS_ACCOUNT,
    productNumber: '123456789',
    bankId: BANK_INFO.BBOG.bankId,
    aval: true
  };

  const dataHolderForm: Partial<AffiliatedAccount> = {
    customer: {
      name: null,
      identificationType: Documents.CC,
      identificationNumber: '123456'
    },
    productAlias: undefined
  };

  const fillInputs = (): void => {
    const namesHolder = screen.getByTestId('namesHolder') as HTMLBdbAtInputElement;
    sherpaEvent.type(namesHolder, { value: 'Pepe Perez' });

    const documenNumber = screen.getByTestId('documenNumber') as HTMLBdbAtInputElement;
    sherpaEvent.type(documenNumber, { value: '1234567890' });

    const customizedName = screen.getByTestId('customizedName') as HTMLBdbAtInputElement;
    sherpaEvent.type(customizedName, { value: 'Pepito Perez' });
  };

  const selectedDocumentType = (text: DocumentsName, value: Documents): void => {
    const documenType = screen.getByTestId('documenType') as HTMLBdbAtDropdownElement;
    const selectedEvent: Event & { detail?: unknown } = createEvent('elementSelectedAtom', documenType);
    selectedEvent.detail = { text, value };
    documenType;
    documenType.dispatchEvent(selectedEvent);
  };

  const submitButtonAction = async () => {
    const button = screen.getByText('Inscribir');
    await waitFor(() => fireEvent.submit(button), { timeout: 100 });
  };

  const errorResponse = {
    originComponent: 'transfer-core',
    backendErrorMessage: 'Error Generico',
    businessErrorCode: '100',
    serverStatusCode: 'TS2209',
    customerErrorMessage: {
      title: 'Cuenta duplicada',
      message: 'Ya tienes esta cuenta inscrita en tus cuentas para realizar transferencias.',
      alertType: 'AlertsMessagesType.GENERIC_WARNING'
    }
  };

  test('Should load the component', () => {
    const enrollAccount = render(
      <Provider store={store}>
        <EnrollHolderForm {...{ dataAccountForm, dataHolderForm, setDataHolderForm, setShowBackdrop }} />
      </Provider>
    );
    expect(enrollAccount).toBeTruthy();
  });

  test('Should fill holder fields', async () => {
    const mockSetState = jest.spyOn(React, 'useState');
    render(
      <Provider store={store}>
        <EnrollAccount />
      </Provider>
    );
    fillInputs();
    selectedDocumentType(DocumentsName.CC, Documents.CC);

    await submitButtonAction();

    expect(mockSetState).toHaveBeenCalled();
  });

  test('Should fill holder fields call the service and receive and error for duplicate account', async () => {
    server.use(
      rest.post('/api-gateway/transfer-core/add-account', (_req, res, ctx) =>
        res(ctx.status(409), ctx.body(JSON.stringify({ data: errorResponse })))
      )
    );
    render(
      <Provider store={store}>
        <EnrollAccount />
      </Provider>
    );
    fillInputs();
    selectedDocumentType(DocumentsName.CC, Documents.CC);

    await submitButtonAction();

    const modalEnrollError: HTMLBdbMlModalElement = await screen.findByTestId('notification-modal');

    const clickOptionEventConfirm: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalEnrollError);
    clickOptionEventConfirm.detail = {
      value: 'Entendido'
    };
    modalEnrollError.dispatchEvent(clickOptionEventConfirm);
    expect(modalEnrollError).toBeTruthy();
  });

  test('Should fill holder fields call the service and receive and technical error', async () => {
    server.use(rest.post('/api-gateway/transfer-core/add-account', (_req, res, ctx) => res(ctx.status(500))));
    render(
      <Provider store={store}>
        <EnrollAccount />
      </Provider>
    );
    fillInputs();
    selectedDocumentType(DocumentsName.CC, Documents.CC);

    await submitButtonAction();

    const modalEnrollError: HTMLBdbMlModalElement = await screen.findByTestId('notification-modal');
    const clickOptionEventClose: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalEnrollError);
    clickOptionEventClose.detail = {
      value: 'Cerrar'
    };
    modalEnrollError.dispatchEvent(clickOptionEventClose);
    expect(modalEnrollError).toBeTruthy();
  });
});
