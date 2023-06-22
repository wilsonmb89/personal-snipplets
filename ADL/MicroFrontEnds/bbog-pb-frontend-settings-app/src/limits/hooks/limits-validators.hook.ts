import { useSelector } from 'react-redux';
import { accountTopLimitSelector } from '../../store/catalogs/catalogs.selector';
import { numberToCurrency } from '../../utils/currency';
import { Limit } from '../models/limit.model';
import { accountLimitSelector, limitsSelector } from '../store/fetch/fetch.selector';

export interface UseLimitsValidator {
  validateAmountTopLimit: (amount: number) => boolean | string;
  validateCountData: (count: number) => boolean | string;
  isAccountLimitLessThanSomeLimits: (limitForm: Omit<Limit, 'desc'>) => boolean;
  isAccountLimitLessThanOfficeLimit: (limitForm: Omit<Limit, 'desc'>) => boolean;
  isLimitGreaterThanAccountLimit: (limitForm: Omit<Limit, 'desc'>) => boolean;
}

export const useLimitsValidator = (currentLimit: Limit): UseLimitsValidator => {
  const accountLimit = useSelector(accountLimitSelector);
  const accountTopLimit = useSelector(accountTopLimitSelector);
  const limits = useSelector(limitsSelector);

  const validateAmountTopLimit = (amount: number) => {
    const topAmount =
      accountLimit.amount > accountTopLimit && !currentLimit.isAccountLimit ? accountLimit.amount : accountTopLimit;
    return amount <= topAmount ? true : `El monto no puede ser superior a ${numberToCurrency(topAmount + '')}`;
  };

  const validateCountData = (count: number) => {
    if (count !== null && count !== undefined) {
      return count > 0
        ? /^\d+$/.test(`${count}`)
          ? true
          : 'Ingrese un valor válido'
        : `El número de trasacciones diarias debe ser mayor que cero`;
    }
    return true;
  };

  const isLimitGreaterThanAccountLimit = (limitForm: Omit<Limit, 'desc'>): boolean => {
    return !currentLimit.isAccountLimit && limitForm.amount > accountLimit.amount;
  };

  const isAccountLimitLessThanOfficeLimit = (limitForm: Omit<Limit, 'desc'>): boolean => {
    return currentLimit.isAccountLimit && limitForm.amount < accountTopLimit && accountLimit.amount > accountTopLimit;
  };

  const isAccountLimitLessThanSomeLimits = (limitForm: Omit<Limit, 'desc'>): boolean => {
    return (
      currentLimit.isAccountLimit &&
      limits.reduce((isLimitgreater, limit) => isLimitgreater || limit.amount > limitForm.amount, false)
    );
  };

  return {
    validateAmountTopLimit,
    validateCountData,
    isAccountLimitLessThanSomeLimits,
    isAccountLimitLessThanOfficeLimit,
    isLimitGreaterThanAccountLimit
  };
};
