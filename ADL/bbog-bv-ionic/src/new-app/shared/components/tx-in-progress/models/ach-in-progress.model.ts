export interface AchInProgressData {
  accountTo: AccountToData;
  transactionCost: string;
  accountFrom: string;
}

interface AccountToData {
  name: string;
  bankName: string;
  acctInfo: string;
}
