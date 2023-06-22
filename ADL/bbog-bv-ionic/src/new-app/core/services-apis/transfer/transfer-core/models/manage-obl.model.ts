export class ManageOblRq {
  public targetAccountId: string;
  public targetAccountType: string;
  public targetAccountBankId: string;
  public affiliationName: string;
  public targetIdNumber: string;
  public targetIdType: string;
  public targetName?: string;
}

export class ManageOblRs {
  public message: string;
}
