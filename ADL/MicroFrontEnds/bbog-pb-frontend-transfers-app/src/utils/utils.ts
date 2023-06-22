import { UseFormRegisterReturn } from 'react-hook-form';
import { BalanceRequestProperty } from '../store/balances/balances.entity';
import { Product } from '../store/products/products.entity';
import { BANK_INFO } from '../constants/bank-codes';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fieldRegistry = (formRegister: UseFormRegisterReturn) => ({
  name: formRegister.name,
  onAtInputOnBlur: formRegister.onBlur,
  onAtInputChanged: formRegister.onChange,
  ref: formRegister.ref
});

/**
 * This function transform a number in format for display on the user interface
 * E.g: 90123761.65 transformed to $ 90.123.761,65
 * E.g: 90123761.65 transformed to $ 90,123,761.65
 * @param value
 * @param currencySign
 * @param decimalLength
 * @param chunkDelimiter
 * @param decimalDelimiter
 * @param chunkLength
 * @returns
 */
export const formatNumber = (
  value: number,
  currencySign = '$ ',
  decimalLength = 2,
  chunkDelimiter = '.',
  decimalDelimiter = ',',
  chunkLength = 3
): string => {
  const result = `\\d(?=(\\d{${chunkLength}})+${decimalLength > 0 ? '\\D' : '$'})`;

  const num = (+value).toFixed(Math.max(0, +decimalLength));

  const number = decimalDelimiter ? num.replace('.', decimalDelimiter) : num;

  return `${currencySign}${number.replace(new RegExp(result, 'g'), '$&' + chunkDelimiter)}`;
};

/**
 * This function make request for api of balances because we need limit quantity of products
 * for request
 * @param products
 * @param limitProductsForRequest
 * @returns
 */
export const makeRequestForBalanceApi = (
  products: Product[],
  limitProductsForRequest = 5
): Array<BalanceRequestProperty[]> => {
  const balanceMap = [];
  let limit = Math.floor(products.length / limitProductsForRequest);
  if (products.length % limitProductsForRequest !== 0) {
    limit++;
  }
  let initial = limitProductsForRequest;
  for (let i = 0; i < limitProductsForRequest * limit; i += limitProductsForRequest) {
    balanceMap.push(
      products.slice(i, initial).map(product => {
        return {
          acctId: product.productNumber,
          acctType: product.productBankType,
          bankId: BANK_INFO.BBOG.bankId,
          officeId: product.officeId,
          acctSubType: product.productBankSubType
        };
      })
    );
    initial += limitProductsForRequest;
  }
  return balanceMap;
};
