import { RootState } from '../../../../store';
import {
  ScheduleTransfersList,
  scheduleTransfersListAdapter,
  ScheduleTransfersListState
} from './scheduled-transfer-list.entity';
import { fromStringToDate } from '../../../../utils/date.utils';
import { BANK_INFO } from '../../../../constants/bank-codes';
import { UpdateScheduledTransferRq } from '../update/update.entity';
import { TargetAccountState } from '../targetAccount/target-account.entity';

interface ValuesCardList {
  label: string;
  amount: string;
  isAmount?: boolean;
}
export interface SchedulesCardDataI {
  id: string;
  accountFromId: string;
  accountToId: string;
  desc: string;
  icon: string;
  title: string;
  transfersRemaining: string;
  values: Array<ValuesCardList>;
  tag?: string;
  typetag?: string;
}

const { selectAll } = scheduleTransfersListAdapter.getSelectors();

const targetAccountSelector = (state: RootState): TargetAccountState => state.targetAccountState;
const scheduleTransfersListSelectedSelector = (state: RootState): ScheduleTransfersList =>
  state.scheduledTransferSelectedState.scheduleTransferSelected;

export const scheduleTransfersListSelector = (state: RootState): ScheduleTransfersListState =>
  state.scheduledTransferListState;

export const getAllScheduleTransfersToList = (state: RootState): SchedulesCardDataI[] => {
  const scheduleTransfersListState = scheduleTransfersListSelector(state);

  return scheduleTransfersListState.completed
    ? prepareData(selectAll(scheduleTransfersListState.scheduleTransfersList))
    : undefined;
};

export const getValidScheduleTransfersToList = (state: RootState): SchedulesCardDataI[] => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const { completed, scheduleTransfersList: scheduleTransfersListEntityState } = scheduleTransfersListSelector(state);
  const scheduleTransfersList = selectAll(scheduleTransfersListEntityState);

  return completed
    ? prepareData(scheduleTransfersList.filter(item => new Date(item.nextExecutionDate) > currentDate))
    : undefined;
};

export const generateDataToList = (
  state: RootState,
  request: UpdateScheduledTransferRq,
  isCreate = true
): ScheduleTransfersList => {
  const { status }: ScheduleTransfersList = scheduleTransfersListSelectedSelector(state);
  const { bankName } = targetAccountSelector(state);

  return {
    accountFrom: {
      acctId: request.accountFrom.accountId,
      acctType: request.accountFrom.accountType,
      bankId: request.accountFrom.bankId,
      bankName: BANK_INFO.BBOG.name
    },
    accountTo: {
      acctId: request.accountTo.accountId,
      acctType: request.accountTo.accountType,
      bankId: request.accountTo.bankId,
      bankName: bankName
    },
    amount: parseInt(request.amount),
    description: request.description,
    destinationAccountHolderIdNumber: request.destinationAccountHolderIdNumber,
    destinationAccountHolderIdType: request.destinationAccountHolderIdType,
    frequency: request.frequency,
    nextExecutionDate: `${request.nextExecutionDate}T00:00:00.000Z`,
    pendingCount: 0,
    recurrent: request.count !== 1,
    scheduledCount: request.count,
    scheduleId: request.scheduledId,
    status: isCreate ? 'PENDING' : status
  };
};

const prepareData = (scheduledTransfers: ScheduleTransfersList[]): SchedulesCardDataI[] => {
  let SDAAccounts: ScheduleTransfersList[] = filterByAccountType(scheduledTransfers, 'SDA');
  let DDAAccounts: ScheduleTransfersList[] = filterByAccountType(scheduledTransfers, 'DDA');

  SDAAccounts = orderByDescription(SDAAccounts);
  DDAAccounts = orderByDescription(DDAAccounts);

  return SDAAccounts.concat(DDAAccounts).map(mapToSchedulesCardDataI);
};

const filterByAccountType = (x: ScheduleTransfersList[], accountType: 'SDA' | 'DDA'): ScheduleTransfersList[] => {
  return x.filter(value => value.accountFrom.acctType === accountType);
};

const orderByDescription = (transfersLists: ScheduleTransfersList[]): ScheduleTransfersList[] => {
  return transfersLists.sort((a, b) => {
    return a.description.localeCompare(b.description);
  });
};

const getAccountNameByType = (accType: string): string => {
  const accountName = {
    SDA: 'Ahorros',
    DDA: 'Corriente'
  }[accType];
  return accountName ? accountName : 'Ahorros';
};
const mapToSchedulesCardDataI = (scheduledTransfer: ScheduleTransfersList): SchedulesCardDataI => {
  return {
    id: scheduledTransfer.scheduleId,
    accountFromId: scheduledTransfer.accountFrom.acctId,
    accountToId: scheduledTransfer.accountTo.acctId,
    desc: `Desde: ${getAccountNameByType(scheduledTransfer.accountFrom.acctType)} No. ${
      scheduledTransfer.accountFrom.acctId
    }`,
    icon: 'ico-saving',
    title: scheduledTransfer.description,
    transfersRemaining:
      scheduledTransfer.scheduledCount === -1 ? 'Siempre' : scheduledTransfer.pendingCount + ' restantes',
    values: [
      {
        amount: new Intl.NumberFormat('es-CO').format(scheduledTransfer.amount),
        isAmount: true,
        label: 'Valor'
      },
      {
        amount: fromStringToDate(scheduledTransfer.nextExecutionDate),
        label: 'Próxima'
      }
    ]
  };
};
