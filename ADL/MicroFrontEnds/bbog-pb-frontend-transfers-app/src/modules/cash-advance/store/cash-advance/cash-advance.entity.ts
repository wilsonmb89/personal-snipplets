export interface CashAdvanceRs {
  message: string;
  approvalId: string;
  requestId: string;
}

export interface CashAdvanceRq {
  card: Card;
  account: Account;
  amount: number;
  secret?: string;
}

interface Account {
  id: string;
  type: string;
  subType: string;
  bankId: string;
}

interface Card {
  id: string;
  type: string;
  brand: string;
}
