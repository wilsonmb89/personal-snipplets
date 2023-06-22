import * as productsActions from '../actions/products.action';
import * as digitalCdtBalancesActions from '../actions/digital-cdt-balances.action';
import * as balancesActions from '../actions/balances.action';
import * as digitalCdtRenewalActions from '../actions/digital-cdt-renewal.action';
import { initialState, ProductsState } from '../states/products.state';
import { ProductBalanceInfo } from '@app/apis/products/products-detail/models/GetBalanceRs';
import { CdtRenewalResponse } from '@app/modules/products/models/cdt-renewal-response';

type actions =
  | productsActions.ProductsActions
  | balancesActions.BalancesActions
  | digitalCdtBalancesActions.DigitalCdtBalancesActions
  | digitalCdtRenewalActions.DigitalCdtRenewalActions;

const updateDigitalCDTRenewal = (digitalCdtBalances: ProductBalanceInfo[], cdtRenewalResponse: CdtRenewalResponse) => {
  const digitalCdtList = JSON.parse(JSON.stringify(digitalCdtBalances));
  const index = digitalCdtList.findIndex(cdt => cdt.accountId === cdtRenewalResponse.cdtNumber);
  digitalCdtList[index]['renewal'] = digitalCdtList[index]['renewal'] === '2' ? '1' : '2';
  return digitalCdtList;
};

export function productsReducer(
  state = initialState,
  action: actions
): ProductsState {
  switch (action.type) {
    case productsActions.GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: JSON.parse(JSON.stringify(action.products)),
      };
    case digitalCdtBalancesActions.GET_CDT_DIGITAL_BALANCES_SUCCESS:
      return {
        ...state,
        digitalCdtBalances: JSON.parse(
          JSON.stringify(action.digitalCdtBalances)
        ),
      };
    case productsActions.SET_PRODUCTS:
      return {
        ...state,
        products: JSON.parse(JSON.stringify(action.products)),
      };
    case digitalCdtBalancesActions.SET_CDT_DIGITAL_BALANCES:
      return {
        ...state,
        digitalCdtBalances: JSON.parse(JSON.stringify(action.digitalCdtBalances)),
      };
    case balancesActions.GET_BALANCES_SUCCESS:
      return {
        ...state,
        balances: JSON.parse(JSON.stringify(action.balances)),
      };
    case balancesActions.ADD_BALANCE:
      return {
        ...state,
        balances: [...state.balances, JSON.parse(JSON.stringify(action.balance))],
      };
    case productsActions.PRODUCTS_RESET:
      // TODO: put initialState when ngrx be updated, the acutal implementation is a workaround
      return {
        products: [],
        balances: [],
        digitalCdtBalances: []
      };
    case digitalCdtRenewalActions.SET_DIGITAL_CDT_RENEWAL_SUCCESS:
      return {
        ...state,
        digitalCdtBalances: updateDigitalCDTRenewal(state.digitalCdtBalances, action.cdtRenewalResponse),
      };
    default:
      return state;
  }
}
