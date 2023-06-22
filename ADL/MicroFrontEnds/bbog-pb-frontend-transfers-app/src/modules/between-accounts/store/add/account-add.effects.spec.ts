import { AffiliatedAccount } from '../../../../store/affiliated-accounts/afilliated-accounts.entity';
import { BANK_INFO, ProductTypes } from '../../../../constants/bank-codes';
import { Documents } from '../../../../constants/document';
import { addNewAccount, SUCCESS_TOAST_CONFIG } from './account-add.effects';
import store from '../../../../store';
import server from '../../../../test-utils/api-mock';

const requestBody: Partial<AffiliatedAccount> = {
  productNumber: '1234567890',
  productType: ProductTypes.SAVINGS_ACCOUNT,
  productBank: BANK_INFO.BBOG.name,
  bankId: BANK_INFO.BBOG.bankId,
  customer: {
    identificationNumber: '132455653',
    identificationType: Documents.CC,
    name: 'Jon Doe'
  },
  productAlias: 'Cuenta de Jon'
};

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

test('Should show success toast with title: "Inscripción exitosa" and return true when Rest API response 200', async () => {
  const response = await store.dispatch(addNewAccount(requestBody, { force: true, disableLoader: true }));
  const toastTitle = store.getState().toastState.title;

  expect(toastTitle).toEqual(SUCCESS_TOAST_CONFIG.title);

  Promise.resolve(response).then(redirect => expect(redirect).toBeTruthy());
});
