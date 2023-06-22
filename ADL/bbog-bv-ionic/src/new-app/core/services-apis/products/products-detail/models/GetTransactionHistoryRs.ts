export interface GetTransactionHistoryRs {
  finalTransactionList: TransactionDetail[];
}

export interface TransactionDetail {
  description: string;
  amount: string;
  date: string;
  instalments: string;
}
