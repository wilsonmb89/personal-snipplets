import { Dispatch } from '@reduxjs/toolkit';
import { interpolateTemplate } from '../../../../utils/text.utils';
import { AffiliatedAccount } from '../../../../store/affiliated-accounts/afilliated-accounts.entity';
import { affiliatedAccountsActions } from '../../../../store/affiliated-accounts/afilliated-accounts.reducer';
import { loadingHandler } from '../../../../store/loader/loader.store';
import { PulseToastState, showToast, Toasts } from '../../../../store/toast/toast.store';
import { addNewAccountApi } from './account-add.api';
import { NewAccountRequest } from './account-add.entity';
import { newAccountActions } from './account-add.reducer';

export const ACTION_TEXT = 'Verificar';

export const SUCCESS_TOAST_CONFIG: Partial<PulseToastState> = {
  title: 'Inscripción exitosa',
  description: 'Inscribimos la cuenta {0} {1} número {2} de {3}',
  type: Toasts.SUCCESS,
  textLink: 'Transferir'
};

export const addNewAccount = (
  newAccount: Partial<AffiliatedAccount>,
  options?: { force?: boolean; disableLoader?: boolean }
): (() => Promise<void>) => {
  const requestBody: NewAccountRequest = {
    targetAccountId: newAccount.productNumber,
    targetAccountType: newAccount.productType,
    targetBankId: newAccount.bankId,
    targetIdNumber: newAccount.customer.identificationNumber,
    targetIdType: newAccount.customer.identificationType,
    targetName: newAccount.customer.name,
    nickName: newAccount.productAlias
  };

  const ACCOUNT_TYPES = {
    SDA: 'de ahorros',
    DDA: 'corriente',
    CMA: 'de depósito electrónico'
  };

  const fetch = async (dispatch: Dispatch): Promise<void> => {
    try {
      await addNewAccountApi(requestBody);
      const { productAlias, productNumber, productBank, productType } = newAccount;
      const modalMessage = interpolateTemplate(SUCCESS_TOAST_CONFIG.description, [
        ACCOUNT_TYPES[productType],
        productAlias,
        productNumber,
        productBank
      ]);
      dispatch(newAccountActions.addNewAccountSuccess());
      dispatch(affiliatedAccountsActions.addAffiliatedAccount(newAccount));
      dispatch(showToast({ ...SUCCESS_TOAST_CONFIG, description: modalMessage }));
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return options?.disableLoader ? fetch : loadingHandler.bind(null, fetch);
};
