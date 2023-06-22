export class DebitCardActivationRq {
  constructor(
    public acctId: string,
    public secretId: string
  ) {}
}

export interface DebitCardActivationRs {
  message: string;
  approvalId: string;
  requestId: string;
}
