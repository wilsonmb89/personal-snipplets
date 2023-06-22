import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useCashAdvanceWorkFlow } from '@cash-advance/hooks/useCashAdvanceWorkflow.hook';
import { savingsProductsWithoutAFCSelector } from '@store/products/products.select';
import { numberWithDecimalToCurrency } from '@utils/currency.utils';
import { TransfersBdbCardPrice } from '@constants/sherpa-tagged-components';
import { makeRequestForBalanceApi } from '@utils/utils';
import { AppDispatch } from '@store/index';
import { balanceDetail } from '@store/balances/balance.effect';
import { ProductAthTypes } from '@constants/bank-codes';

interface ItemData {
  cardName?: string;
  cardDescription?: string;
  labelValue?: string;
  secureValue?: string;
  value?: string;
  isChecked?: string;
  seeDetails?: boolean;
  isDisabled?: boolean;
  cardDescription2?: string;
  cardDescription3?: string;
  tag?: {
    isSolid?: boolean;
    type?: string;
    text: string;
  };
}

const AccountsListSelector = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();

  const accounts = useSelector(savingsProductsWithoutAFCSelector);

  const { destinationAcctSelected, setDestinationAcct } = useCashAdvanceWorkFlow();

  const [listValues, setListValues] = useState<string>('[]');

  useEffect(() => {
    if (accounts?.length > 0) {
      validateAccountsBalances();
      if (!destinationAcctSelected && accounts?.length === 1) {
        setDestinationAcct(accounts[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (accounts?.length > 0) {
      mapListValues();
    }
  }, [accounts]);

  useEffect(() => {
    if (destinationAcctSelected) {
      mapListValues();
    }
  }, [destinationAcctSelected]);

  const validateAccountsBalances = (): void => {
    makeRequestForBalanceApi(accounts).forEach(balanceRequest => {
      dispatch(
        balanceDetail({ productsInfo: balanceRequest }, [
          ProductAthTypes.CHECK_ACCOUNT,
          ProductAthTypes.SAVINGS_ACCOUNT
        ])
      );
    });
  };

  const mapListValues = (): void => {
    const itemsList: ItemData[] = accounts.map<ItemData>(account => {
      const acctBalanceDetail = account.balanceInfo?.balanceDetail;
      let acctChecked = 'false';
      if (destinationAcctSelected?.productNumber && destinationAcctSelected?.productNumber === account.productNumber) {
        acctChecked = 'true';
      }
      return {
        cardName: account.productName,
        cardDescription: account.description,
        cardDescription2: `No. ${account.productNumber}`,
        cardDescription3: `Saldo: ${
          acctBalanceDetail && acctBalanceDetail.Avail ? numberWithDecimalToCurrency(acctBalanceDetail.Avail) : '-'
        }`,
        isChecked: acctChecked,
        value: 'false'
      };
    });
    setListValues(JSON.stringify(itemsList));
  };

  const cardSelectedHandler = ({ detail }): void => {
    const selectedName = detail.cardName;
    const selectedNumber = detail.cardDescription2.replace('No.', '').trim();
    const acctSelected = accounts.find(
      acctP => acctP.productName === selectedName && acctP.productNumber === selectedNumber
    );
    if (acctSelected) {
      setDestinationAcct(acctSelected);
    }
  };

  return (
    <>
      {listValues !== '[]' && (
        <TransfersBdbCardPrice
          idEl="account-selector"
          data-testid="account-selector"
          onCardSelected={cardSelectedHandler}
          valuesCards={listValues}
        />
      )}
    </>
  );
};

export default AccountsListSelector;
