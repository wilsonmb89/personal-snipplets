import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accountTopLimitSelector } from '../../store/catalogs/catalogs.selector';
import { showError } from '../../store/error/error.store';
import { numberToCurrency } from '../../utils/currency';
import { Limit } from '../models/limit.model';
import * as updateActions from '../store/update/update.effect';
import { updateLimitActions } from '../store/update/update.reducer';
import { useLimitsValidator } from './limits-validators.hook';

export interface UseLimitForm {
  updateLimit: (limitForm: Omit<Limit, 'desc'>) => void;
  confirmUpdate: () => void;
  confirm: ConfirmData;
  setConfirmData: (data: ConfirmData) => void;
}

interface ConfirmData {
  title: string;
  description: string;
}

export const useLimitsForm = (currentLimit: Limit): UseLimitForm => {
  const accountTopLimit = useSelector(accountTopLimitSelector);
  const dispatch = useDispatch();
  const [confirm, setConfirm] = useState(null);

  const {
    isAccountLimitLessThanSomeLimits,
    isAccountLimitLessThanOfficeLimit,
    isLimitGreaterThanAccountLimit
  } = useLimitsValidator(currentLimit);

  const confirmUpdate = () => {
    currentLimit.isAccountLimit ? dispatch(updateActions.updateAccountLimit()) : dispatch(updateActions.updateLimit());
    setConfirmData(null);
  };

  const setConfirmData = (data: ConfirmData) => {
    setConfirm(data);
  };

  const updateLimit = (limitForm: Omit<Limit, 'desc'>) => {
    dispatch(updateLimitActions.setLimitForUpdate(limitForm));

    if (isLimitGreaterThanAccountLimit(limitForm)) {
      Promise.all([dispatch(updateActions.updateLimit()), dispatch(updateActions.updateAccountLimit())]).then(() => {
        dispatch(
          showError({
            name: 'Actualizamos tu Límite de Cuenta',
            message: `El monto máximo del Límite de Cuenta se actualizó a ${numberToCurrency(
              limitForm.amount
            )} para que puedas realizar tus transacciones. Recuerda que siempre debe ser mayor o igual a la suma de tus transacciones diarias.`
          })
        );
      });
    } else if (isAccountLimitLessThanOfficeLimit(limitForm)) {
      setConfirmData({
        title: 'El Límite de cuenta va a disminuir',
        description: `Recuerda que si deseas un monto superior a ${numberToCurrency(
          accountTopLimit
        )} debes dirigirte a una oficina. \n ¿Estás seguro de hacer este cambio?`
      });
    } else if (isAccountLimitLessThanSomeLimits(limitForm)) {
      setConfirmData({
        title: 'Algunos topes son mayores a Límite de Cuenta',
        description: `Tienes topes con mayor valor, el tope que regirá será el valor de Límite de Cuenta. Recuerda que el Límite de Cuenta controla la suma de tus transacciones diarias.`
      });
    } else if (currentLimit.isAccountLimit) {
      dispatch(updateActions.updateAccountLimit());
    } else {
      dispatch(updateActions.updateLimit());
    }
  };

  return { updateLimit, confirmUpdate, confirm, setConfirmData };
};
