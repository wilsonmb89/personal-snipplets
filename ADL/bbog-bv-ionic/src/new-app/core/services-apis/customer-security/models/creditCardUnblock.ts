export interface CreditCardUnblockRq {
  cardId: string;
  statusDesc: string;
  plasticValidation: string;
}

export interface CreditCardUnblockRs {
  description: string;
  cardId: string;
  operationType: string;
}
