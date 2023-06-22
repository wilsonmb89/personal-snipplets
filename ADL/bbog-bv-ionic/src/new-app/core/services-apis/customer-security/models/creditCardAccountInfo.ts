export interface CreditCardAccountInfoRq {
  cardId: string;
}

export interface CreditCardAccountInfoRs {
  cardProductId: string;
  cardId: string;
  cardSeqNum: string;
  cardStatusCode: string;
  cardMassiveProcess: string;
  accountProductId: string;
  accountBankBranchName: string;
  lockId: string;
}
