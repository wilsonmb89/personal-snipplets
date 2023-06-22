import React from 'react';
import { BANK_INFO, ProductTypes } from '../../../../constants/bank-codes';
import { AffiliatedAccount } from '../../../../store/affiliated-accounts/afilliated-accounts.entity';
import { createEvent, fireEvent, render, screen, waitFor } from '../../../../test-utils/provider-mock';
import { BetweenAccountPaths } from '../../constants/navigation-paths';
import EnrollAccountDestinationForm from './EnrollAccountDestinationForm';
import { CATALOG_NAME } from '../../../../constants/catalog-names';
import server, { getBankListCatalogsResponse } from '../../../../test-utils/api-mock';
import store from '../../../../store';
import EnrollAccount from '../../pages/enroll-account/EnrollAccount';
import { axiosADLInstance } from '@utils/constants';
import { sherpaEvent } from '../../../../test-utils/sherpa-event';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: BetweenAccountPaths.ENROLL_DESTINATION_ACCOUNT
  })
}));

describe('Enroll account destination form component', () => {
  const OLD_ENV = process.env;
  const postSpy = jest.spyOn(axiosADLInstance, 'post');

  const dataAccountForm: Partial<AffiliatedAccount> = {
    productBank: BANK_INFO.BBOG.name,
    productType: ProductTypes.SAVINGS_ACCOUNT,
    productNumber: '123456789',
    bankId: BANK_INFO.BBOG.bankId,
    aval: true
  };

  const setDataAccountForm = jest.fn();

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch({ type: 'UNMOUNT' });
    render(<EnrollAccount />);
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

  const fillBankingEntity = async (bankListOrder: number): Promise<void> => {
    const bankingEntityAutocomplete = await waitFor(() => screen.findByTestId('bankingEntity'));
    const selectOptionEvent: Event & { detail?: unknown } = createEvent(
      'eventOptionSelected',
      bankingEntityAutocomplete
    );
    const electronicDepositValues = getBankListCatalogsResponse.catalogItems[bankListOrder];
    selectOptionEvent.detail = { text: electronicDepositValues.name, value: electronicDepositValues.id };
    bankingEntityAutocomplete.dispatchEvent(selectOptionEvent);
  };

  const submitButtonAction = async () => {
    const button = screen.getByText('Continuar');
    await waitFor(() => fireEvent.submit(button), { timeout: 100 });
  };

  test('Should load the component', async () => {
    const enrollAccount = render(<EnrollAccountDestinationForm {...{ dataAccountForm, setDataAccountForm }} />);
    expect(enrollAccount).toBeTruthy();
  });

  test('should get catalogs', () => {
    expect(postSpy.mock.calls[0]).toEqual(['user-features/get-catalog', { catalogName: CATALOG_NAME.BANK_LIST }]);
  });

  test('Should fill in fields of a bank account', async () => {
    const mockSetState = jest.spyOn(React, 'useState');
    await waitFor(() => screen.findByTestId('enroll-account-form'));
    await fillBankingEntity(0);

    const productNumber = screen.getByTestId('productNumber') as HTMLBdbAtInputElement;
    sherpaEvent.type(productNumber, { value: '123456789' });

    // TODO: validate horizontal selector
    // const productTypeSelector = await waitFor(() => screen.findByTestId('productType'));

    await submitButtonAction();

    expect(mockSetState).toHaveBeenCalled();
  });

  test('Should fill in the fields of an electronic deposit', async () => {
    const mockSetState = jest.spyOn(React, 'useState');
    await waitFor(() => screen.findByTestId('enroll-account-form'));
    await fillBankingEntity(1);

    const productNumber = screen.getByTestId('productNumber') as HTMLBdbAtInputElement;
    sherpaEvent.type(productNumber, { value: '123456789' });

    await submitButtonAction();
    expect(mockSetState).toHaveBeenCalled();
  });

  test('Should take an option not available to banking entity', async () => {
    const mockSetState = jest.spyOn(React, 'useState');
    await waitFor(() => screen.findByTestId('enroll-account-form'));
    const bankingEntityAutocomplete = await waitFor(() => screen.findByTestId('bankingEntity'));
    const selectOptionEvent: Event & { detail?: unknown } = createEvent('eventQueryChanged', bankingEntityAutocomplete);
    selectOptionEvent.detail = { text: 'Banco XYZ' };
    bankingEntityAutocomplete.dispatchEvent(selectOptionEvent);
    expect(mockSetState).toHaveBeenCalled();
  });
});
