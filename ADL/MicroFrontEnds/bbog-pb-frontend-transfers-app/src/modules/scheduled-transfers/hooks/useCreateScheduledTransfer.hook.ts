import { useDispatch, useSelector } from 'react-redux';

import { currencyToNumber } from '../../../utils/currency.utils';
import { customerSelector } from '../../../store/user-features/user-features.select';
import { ScheduledTransferFormInputs } from '../components/scheduled-transfer-form/ScheduledTransferForm';
import { useScheduledTransfer } from './useScheduledTransfer.hook';
import { createScheduledTransfer } from '../store/create/create.effect';
import { AppDispatch } from '../../../store';
import { INDEFINITE_TRANSFER_COUNT, TRANSFER_COUNT_TYPE } from '../constants/schedule-transfers';

interface UseCreateScheduledTransfer {
  createScheduledTransferData: (scheduledTransfer: ScheduledTransferFormInputs) => void;
}

const successToastProps = 'Tu programación ha sido creada con éxito.';

export const useCreateScheduledTransfer = (): UseCreateScheduledTransfer => {
  const dispatch: AppDispatch = useDispatch();

  const customer = useSelector(customerSelector);

  const { rootScheduledAndShowToast } = useScheduledTransfer();

  const createScheduledTransferData = async (data: ScheduledTransferFormInputs) => {
    const [accountId, accountType] = data.accountFrom.split('_');
    const request = {
      accountFrom: { accountType, accountId, bankId: '0001' },
      nextExecutionDate: data.nextExecutionDate,
      amount: currencyToNumber(data.amount).toString(),
      destinationAccountHolderIdNumber: customer.identificationNumber,
      destinationAccountHolderIdType: customer.identificationType,
      description: data.description,
      frequency: data.frequency,
      countType: data.indefinite ? TRANSFER_COUNT_TYPE.REPEAT_EVER : TRANSFER_COUNT_TYPE.REPEAT,
      count: data.indefinite ? INDEFINITE_TRANSFER_COUNT : parseInt(data.count)
    };
    dispatch(createScheduledTransfer(request)).then(() => rootScheduledAndShowToast(successToastProps));
  };

  return { createScheduledTransferData };
};
