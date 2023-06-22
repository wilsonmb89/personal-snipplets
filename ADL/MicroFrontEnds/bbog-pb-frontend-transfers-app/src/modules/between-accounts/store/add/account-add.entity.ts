import { ProductType } from '../../../../constants/bank-codes';
import { DocumentType } from '../../../../constants/document';

export interface NewAccountRequest {
  targetAccountId: string;
  targetAccountType: ProductType;
  targetBankId: string;
  targetIdNumber: string;
  targetIdType: DocumentType;
  targetName: string;
  nickName: string;
}

export interface NewAccountResponse {
  message: string;
  approvalId: string;
  requestId: string;
}

export interface NewAccountState {
  addNewAccountSuccess: boolean;
  addNewAccountError: string;
}

export const initialState = {
  addNewAccountSuccess: undefined,
  addNewAccountError: ''
};
