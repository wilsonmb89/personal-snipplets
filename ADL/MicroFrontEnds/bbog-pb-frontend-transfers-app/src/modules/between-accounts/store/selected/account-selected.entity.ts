import { Product } from '../../../../store/products/products.entity';

export interface AccountSelectState {
  accountOwnSelected: Product;
}

export const initialState: AccountSelectState = {
  accountOwnSelected: {
    productName: '',
    description: '',
    officeId: '',
    productAthType: '',
    productBankType: null,
    productBankSubType: '',
    productNumber: '',
    valid: false,
    franchise: '',
    openDate: ''
  }
};
