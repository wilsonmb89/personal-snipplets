export interface AddCreditCardAdvanceRq {
  card: Card;
  account: Account;
  amount: number;
  secret: string;
}

export interface Card {
  id: string;
  type: string;
  brand: string;
}

export interface Account {
  id: string;
  type: string;
  subType: string;
  bankId: string;
}

export interface AddCreditCardAdvanceRs {
  message: string;
  approvalId: string;
  requestId: string;
}
