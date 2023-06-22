import { useState } from 'react';
import { BANK_TYPES } from '../../../constants/bank-codes';
import { ScheduleTransfersList } from '../store/list/scheduled-transfer-list.entity';

interface UseScheduledTransferValidators {
  toogleCheck: () => void;
  validateFrecuency: (frecuency: string) => void;
  validateIndefiniteCheck: (scheduleTransferSelected: ScheduleTransfersList) => void;
  validateAccountType: (accountType: string) => string;
  indefiniteCheck: boolean;
  indefiniteDisable: boolean;
  limitDate: {
    minAllowed: Date;
    maxAllowed: Date;
  };
}

export const useScheduledTransferValidators = (): UseScheduledTransferValidators => {
  const ONLY_ONCE_FRECUENCY = 'ONLY_ONCE';

  const [indefiniteCheck, setIndefiniteCheck] = useState(false);
  const [indefiniteDisable, setIndefiniteDisable] = useState(false);

  const minDate = new Date();
  minDate.setDate(minDate.getDate());
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  const limitDate = {
    minAllowed: minDate,
    maxAllowed: maxDate
  };

  const validateFrecuency = (frecuency: string) => {
    setIndefiniteDisable(frecuency === ONLY_ONCE_FRECUENCY);
    if (frecuency === ONLY_ONCE_FRECUENCY) {
      setIndefiniteCheck(false);
    }
  };

  const validateIndefiniteCheck = (scheduleTransferSelected: ScheduleTransfersList): void => {
    const { recurrent, scheduledCount } = scheduleTransferSelected;
    if (recurrent && scheduledCount === 0) {
      setIndefiniteCheck(true);
    }
  };

  const toogleCheck = (): void => {
    setIndefiniteCheck(!indefiniteCheck);
  };

  const validateAccountType = (accountType: string): string => {
    return accountType === BANK_TYPES.SAVINGS_ACCOUNT.code
      ? BANK_TYPES.SAVINGS_ACCOUNT.name
      : BANK_TYPES.CHECK_ACCOUNT.name;
  };

  return {
    indefiniteCheck,
    indefiniteDisable,
    limitDate,
    toogleCheck,
    validateFrecuency,
    validateIndefiniteCheck,
    validateAccountType
  };
};
