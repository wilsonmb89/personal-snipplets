export interface CreditCardBlockRq {
  cardId: string;
  statusDesc: string;
  lockId: string;
  blockReason: string;
}

export interface CreditCardBlockRs {
  description: string;
  cardId: string;
  operationType: string;
}
