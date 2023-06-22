export interface TargetAccountState {
  accountAlias: string;
  accountType: string;
  accountId: string;
  bankId: string;
  bankName: string;
  isAval: boolean | 'true' | 'false';
}

export const initialState: TargetAccountState = {
  accountAlias: null,
  accountType: null,
  accountId: null,
  bankId: null,
  bankName: null,
  isAval: false
};
