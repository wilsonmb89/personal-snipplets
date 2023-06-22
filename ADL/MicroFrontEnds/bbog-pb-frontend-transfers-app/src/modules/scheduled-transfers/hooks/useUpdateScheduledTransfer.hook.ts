import { useSelector, useDispatch } from 'react-redux';
import { getScheduleTransferSelected } from '../store/selected/scheduled-transfer-selected.select';
import { ScheduledTransferFormInputs } from '../components/scheduled-transfer-form/ScheduledTransferForm';
import { currencyToNumber } from '../../../utils/currency.utils';
import { customerSelector } from '../../../store/user-features/user-features.select';
import { updateScheduledTransfer } from '../store/update/update.effect';
import { useScheduledTransfer } from './useScheduledTransfer.hook';
import { targetAccountSelector } from '../store/targetAccount/target-account.select';
import { AppDispatch } from '../../../store';
import { INDEFINITE_TRANSFER_COUNT, TRANSFER_COUNT_TYPE } from '../constants/schedule-transfers';

interface UseUpdateScheduledTransfer {
  updateScheduledTransferData: (scheduledTransfer: ScheduledTransferFormInputs) => void;
}

const successToastProps = 'Programación modificada exitosamente';

export const useUpdateScheduledTransfer = (): UseUpdateScheduledTransfer => {
  const dispatch: AppDispatch = useDispatch();

  const customer = useSelector(customerSelector);
  const { scheduleId } = useSelector(getScheduleTransferSelected);

  const { rootScheduledAndShowToast } = useScheduledTransfer();
  const targetAccount = useSelector(targetAccountSelector);

  const updateScheduledTransferData = async (data: ScheduledTransferFormInputs) => {
    const [accountId, accountType] = data.accountFrom.split('_');
    const request = {
      scheduledId: scheduleId,
      accountFrom: { accountType, accountId, bankId: '0001' },
      accountTo: {
        accountType: targetAccount.accountType,
        accountId: targetAccount.accountId,
        bankId: targetAccount.bankId
      },
      nextExecutionDate: data.nextExecutionDate,
      amount: currencyToNumber(data.amount).toString(),
      destinationAccountHolderIdNumber: customer.identificationNumber,
      destinationAccountHolderIdType: customer.identificationType,
      description: data.description,
      frequency: data.frequency,
      countType: data.indefinite ? TRANSFER_COUNT_TYPE.REPEAT_EVER : TRANSFER_COUNT_TYPE.REPEAT,
      count: data.indefinite ? INDEFINITE_TRANSFER_COUNT : parseInt(data.count)
    };
    dispatch(updateScheduledTransfer(request)).then(() => rootScheduledAndShowToast(successToastProps));
  };

  return { updateScheduledTransferData };
};
