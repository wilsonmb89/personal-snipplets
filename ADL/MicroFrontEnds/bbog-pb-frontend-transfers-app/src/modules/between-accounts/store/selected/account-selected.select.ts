import { RootState } from '../../../../store';
import { Product } from '../../../../store/products/products.entity';

export const getOwnAccountSelected = (state: RootState): Product => state.accountSelectedState.accountOwnSelected;
