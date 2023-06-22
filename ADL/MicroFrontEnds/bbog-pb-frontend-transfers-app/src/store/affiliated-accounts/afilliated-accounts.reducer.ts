import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sessionStorageReducer } from '../session-storage.reducer';
import { DeleteAccountRequest } from '../../modules/between-accounts/store/delete/account-delete.entity';
import { AffiliatedAccount, affiliatedAccountsAdapter, initialState } from './afilliated-accounts.entity';

export const defaultAffiliatedAccount: AffiliatedAccount = {
  productBank: '',
  bankId: '',
  aval: false,
  productAlias: '',
  productName: '',
  productType: null,
  productNumber: '',
  description: '',
  priority: '',
  customer: null,
  contraction: ''
};

export const affiliatedAccountsState = createSlice({
  name: 'AffiliatedAccountsState',
  initialState,
  reducers: {
    fetchAffiliatedAccounts(state, { payload }: PayloadAction<AffiliatedAccount[]>) {
      affiliatedAccountsAdapter.setAll(state.affiliatedAccounts, payload);
      state.completed = true;
    },
    fetchAffiliatedAccountsError(state, { payload }: PayloadAction<Error>) {
      state.affiliatedAccounts = initialState.affiliatedAccounts;
      state.error = payload;
      state.completed = false;
    },
    deleteAffiliatedAccount(state, { payload }: PayloadAction<DeleteAccountRequest>) {
      const { targetAccountId, targetAccountType, targetBankId } = payload;
      affiliatedAccountsAdapter.removeOne(
        state.affiliatedAccounts,
        `${targetAccountId}-${targetAccountType}-${targetBankId}`
      );
    },
    addAffiliatedAccount(state, { payload }: PayloadAction<Partial<AffiliatedAccount>>) {
      const newAccount = { ...defaultAffiliatedAccount, ...payload };
      affiliatedAccountsAdapter.addOne(state.affiliatedAccounts, newAccount);
      state.error = null;
      state.completed = true;
    },
    setAccountAffiliatedSelected(state, { payload }: PayloadAction<AffiliatedAccount>) {
      const { productNumber, productType, bankId } = payload;
      return {
        ...state,
        affiliatedAccountSelected: affiliatedAccountsAdapter
          .getSelectors()
          .selectAll(state.affiliatedAccounts)
          .find(
            product =>
              product.productNumber === productNumber &&
              product.productType === productType &&
              product.bankId === bankId
          )
      };
    },
    resetAffiliatedSelected(state) {
      return {
        ...state,
        affiliatedAccountSelected: initialState.affiliatedAccountSelected
      };
    },
    reset(state) {
      state.affiliatedAccounts = initialState.affiliatedAccounts;
      state.error = null;
      state.completed = false;
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'AffiliatedAccountsState', [
      'fetchAffiliatedAccounts',
      'addAffiliatedAccount',
      'deleteAffiliatedAccount'
    ]);
  }
});

export const affiliatedAccountsActions = affiliatedAccountsState.actions;
