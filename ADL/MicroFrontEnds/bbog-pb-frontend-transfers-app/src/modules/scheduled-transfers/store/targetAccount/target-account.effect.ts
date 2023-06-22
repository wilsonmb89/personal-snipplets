import { Dispatch } from 'redux';
import { RootState } from '../../../../store/index';
import { AffiliatedAccount } from '../../../../store/affiliated-accounts/afilliated-accounts.entity';
import { getValidAffiliatedAndProducts } from '../../../../store/affiliated-accounts/afilliated-accounts.select';
import { targetAccountActions } from './target-account.reducer';
import { removeLeadingZeros } from '../../../../utils/text.utils';

export const setTargetAccountByAffiliateId = (
  acctId: string
): ((dispatch: Dispatch, getState: () => RootState) => void) => {
  return (dispatch: Dispatch, getState: () => RootState): boolean => {
    dispatch(targetAccountActions.reset());
    const affiliatedAccounts = getValidAffiliatedAndProducts(getState());
    const affiliatedAccount = affiliatedAccounts.find(
      acct => removeLeadingZeros(acct.productNumber) === removeLeadingZeros(acctId)
    );
    if (affiliatedAccount) {
      dispatch(
        targetAccountActions.setTargetAccount({
          accountAlias: affiliatedAccount.productAlias,
          accountType: affiliatedAccount.productType,
          accountId: affiliatedAccount.productNumber,
          bankId: affiliatedAccount.bankId,
          bankName: affiliatedAccount.productBank,
          isAval: affiliatedAccount.aval
        })
      );
    }
    return !!affiliatedAccount;
  };
};

export const setTargetAccountByAccountSelected = (account: AffiliatedAccount): ((dispatch: Dispatch) => void) => {
  return (dispatch: Dispatch): void => {
    dispatch(
      targetAccountActions.setTargetAccount({
        accountAlias: account.productAlias,
        accountType: account.productType,
        accountId: account.productNumber,
        bankId: account.bankId,
        bankName: account.productBank,
        isAval: account.aval
      })
    );
  };
};
