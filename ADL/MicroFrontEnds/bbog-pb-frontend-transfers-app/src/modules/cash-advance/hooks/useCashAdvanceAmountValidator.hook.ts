import { MIN_VALUE_AMOUNT_CASH_ADVANCE } from '@cash-advance/constants/utilsConstants';
import { currencyToNumberSherpa, numberWithDecimalToCurrency } from '@utils/currency.utils';

export interface UseCashAdvanceAmountValidator {
  validateCashAdvanceAmount: (amount: string, availCredit: string) => boolean | string;
}

export const useCashAdvanceAmountValidator = (): UseCashAdvanceAmountValidator => {
  const validateCashAdvanceAmount = (amount: string, availCredit: string): boolean | string => {
    const parsedAmount = currencyToNumberSherpa(amount);
    const parsedAvailCredit = availCredit ? +availCredit : 0;
    if (parsedAmount !== null && parsedAmount !== undefined) {
      if (parsedAmount <= 0) {
        return `El valor del avance deber ser mayor a ${MIN_VALUE_AMOUNT_CASH_ADVANCE}`;
      } else if (parsedAmount > parsedAvailCredit) {
        return `Cupo de avances insuficiente, tu cupo es ${numberWithDecimalToCurrency(availCredit)}`;
      }
    }
    return true;
  };

  return { validateCashAdvanceAmount };
};
