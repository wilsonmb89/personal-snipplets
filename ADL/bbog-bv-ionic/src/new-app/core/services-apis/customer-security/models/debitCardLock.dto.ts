export class DebitCardLockRq {
  constructor(
    public accountId: string,
    public referenceType: string
  ) {}
}

export interface DebitCardLockRs {
  message: string;
  approvalId: string;
  requestId: string;
}
