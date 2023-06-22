import { removeLeadingZeros } from '@utils/text.utils';
import { Dispatch } from 'redux';
import { RootState } from '..';
import { loadingHandler } from '../loader/loader.store';
import { Product, productsAdapter } from '../products/products.entity';
import { productsActions } from '../products/products.reducer';
import { balanceActions } from './balance.reducer';
import { balanceApi } from './balances.api';
import { BalanceRequest, ProductBalanceInfo } from './balances.entity';
import { isEqual } from 'lodash';
import { ProductAthType } from '@constants/bank-codes';

const { selectAll } = productsAdapter.getSelectors();

export const balanceDetail = (dataRequest: BalanceRequest, types?: ProductAthType[]): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    try {
      const productsWithoutBalance = selectAll(getState().productsState.products).filter(
        ({ productAthType, balanceInfo }) => {
          if (types) return types.find(type => type === productAthType) && !balanceInfo;
          return !balanceInfo;
        }
      );

      if (productsWithoutBalance.length === 0) return;

      const balancesResponse = await balanceApi(dataRequest);

      dataRequest.productsInfo.forEach(({ acctId }) => {
        const product: Product = productsWithoutBalance.find(({ productNumber }) =>
          isEqual(removeLeadingZeros(productNumber), removeLeadingZeros(acctId))
        );

        const balanceInfo: ProductBalanceInfo = balancesResponse.find(({ accountId }) =>
          isEqual(removeLeadingZeros(acctId), removeLeadingZeros(accountId))
        );

        if (balanceInfo && product) {
          dispatch(
            productsActions.updateProduct({
              ...product,
              balanceInfo
            })
          );
        }
      });
    } catch (error) {
      dispatch(balanceActions.setError(error));
    }
  };
  return loadingHandler.bind(null, fetch);
};
