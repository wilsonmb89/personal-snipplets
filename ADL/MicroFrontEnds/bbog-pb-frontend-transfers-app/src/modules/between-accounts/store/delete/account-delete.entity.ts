export interface DeleteAccountRequest {
  nickName: string;
  targetAccountId: string;
  targetAccountType: string;
  targetBankId: string;
}

export interface DeleteAccountResponse {
  message: string;
  approvalId: string;
  requestId: string;
}
