export interface TxHistoryModel {
  channelInfo: ChannelInfo;
  orderInfo: OrderInfo;
  accountFrom: AccountFrom;
  accountTo: AccountTo;
  transactionInfo: TransactionInfo;
  transactionCost: TransactionCost;
}

interface TransactionCost {
  amt: number;
  curCode: string;
}

interface TransactionInfo {
  desc: string;
  trnId: string;
}

export interface AccountTo {
  acctId: string;
  acctType: string;
  acctKey: string;
  bankInfo: BankInfo;
}

interface BankInfo {
  bankId: string;
  name: string;
  branchId: string;
}

export interface AccountFrom {
  acctId: string;
  acctType: string;
  acctKey: string;
}

export interface OrderInfo {
  desc: string;
  expDt: string;
  memo: string;
  billId: string;
  rcptName: string;
  ipAddr: string;
  numAuthTrn: string;
  trnTime: string;
  paymentConcept: string;
  transactionCost?: string;
}

interface ChannelInfo {
  desc: string;
  channel: string;
}
