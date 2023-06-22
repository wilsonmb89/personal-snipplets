import { IAttributeResumeAvatar } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/types/components/sherpa-ml/bdb-ml-resume/IResume';

export interface TransferAccount {
  displayValue: string;
  amount: string;
  note: string;
  numberOfBill: string;
  accountTo: {
    avatar?: IAttributeResumeAvatar;
    icon?: string;
    title?: string;
    description: string;
    productBankName?: string;
  };
  accountFrom: {
    productBankType: string;
    productBankSubType: string;
    description: string;
    productNumber: string;
  };
}

interface TransferAccountState {
  accountTransfer: TransferAccount;
  transferResponse: TransferResponse;
}

export const initialState: TransferAccountState = {
  accountTransfer: {
    displayValue: '-',
    amount: '',
    note: '',
    numberOfBill: '',
    accountTo: {
      avatar: {
        color: '',
        text: ''
      },
      icon: '',
      description: '-',
      title: '',
      productBankName: ''
    },
    accountFrom: {
      description: '-',
      productBankType: '',
      productBankSubType: '',
      productNumber: ''
    }
  },
  transferResponse: {
    approvalId: '',
    message: '',
    requestId: '',
    status: 0
  }
};

export interface TransferRequest {
  amount: number;
  accFromId: string;
  accFromType: string;
  accFromSubType: string;
  branchId: string;
  accToId: string;
  accToType: string;
  accToSubType: string;
  bankIdAcctTo: string;
  paymentConcept?: string;
  billId?: string;
  forceTrx?: boolean;
}

export interface TransferResponse {
  message?: string;
  approvalId?: string;
  requestId?: string;
  status: number;
}
