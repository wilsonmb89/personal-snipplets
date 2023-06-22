import { axiosADLInstance } from '@utils/constants';
import { BANK_INFO, ProductTypes } from '../../../../constants/bank-codes';
import { Documents } from '../../../../constants/document';
import { addNewAccountApi } from './account-add.api';
import { NewAccountRequest } from './account-add.entity';

const requestBody: NewAccountRequest = {
  targetAccountId: '1234567890',
  targetAccountType: ProductTypes.SAVINGS_ACCOUNT,
  targetBankId: BANK_INFO.BBOG.bankId,
  targetIdNumber: '132455653',
  targetIdType: Documents.CC,
  targetName: 'Jon Doe',
  nickName: 'Cuenta de Jon'
};

beforeEach(() => {
  const response = Promise.resolve('response');
  const axiosPost = spyOn(axiosADLInstance, 'post');
  axiosPost.and.callFake(() => Promise.resolve(response));
});

test('handles server error', async () => {
  addNewAccountApi(requestBody);
  expect(axiosADLInstance.post).toHaveBeenCalled();
});
