export interface DeleteAccountRq {
  targetName?: string;
  targetIdNumber?: string;
  targetIdType?: string;
  nickName: string;
  targetAccountId: string;
  targetAccountType: string;
  targetBankId: string;
}

export interface DeleteAccountRs {
  message: string;
  approvalId: string;
  requestId: string;
}
