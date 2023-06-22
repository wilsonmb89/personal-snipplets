import { RootState } from '../../../../store';
import { TransferAccount, TransferResponse } from './account-transfer.entity';

export const getTransferAccount = (state: RootState): TransferAccount => state.transferAccountState.accountTransfer;

export const getTransferResponse = (state: RootState): TransferResponse => state.transferAccountState.transferResponse;
