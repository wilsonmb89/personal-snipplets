export class DoTransferRq {
  constructor(
    public amount: number,
    public accFromId: string,
    public accFromType: string,
    public accFromSubType: string,
    public branchId: string,
    public accToId: string,
    public accToType: string,
    public accToSubType: string,
    public bankIdAcctTo: string,
    public paymentConcept?: string,
    public billId?: string,
    public forceTrx?: boolean
  ) {}
}

export interface DoTransferRs {
  message: string;
  approvalId: string;
  requestId: string;
}
