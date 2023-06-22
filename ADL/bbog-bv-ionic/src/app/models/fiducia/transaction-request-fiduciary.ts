export class TransactionRequestFiduciary {
  constructor(
    public finalDate: string,
    public initialDate: string,
    public numberFund: string,
    public typeFund: string
  ) {}
}
