export class GetCardsRq {
  constructor(
    public acctId: string,
    public acctType: string,
    public requireAllCards: string,
    public cardStatus: string[],
  ) {}
}

export interface GetCardsRs {
  accountList: AccountList[];
}

export interface AccountList {
  bankId: string;
  productBankType: string;
  productNumber: string;
  status: string;
  description?: string;
  lockId?: string;
}
