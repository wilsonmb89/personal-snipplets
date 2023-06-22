import { ProductBalanceInfo } from '../../../../core/services-apis/products/products-detail/models/GetBalanceRs';
import { ApiProductDetail } from '../../../../core/services-apis/products/products/models/products';

export interface ProductsState {
  products: ApiProductDetail[];
  balances: ProductBalanceInfo[];
  digitalCdtBalances: ProductBalanceInfo[];
}

export const initialState: ProductsState = {
  products: [],
  balances: [],
  digitalCdtBalances: []
};
