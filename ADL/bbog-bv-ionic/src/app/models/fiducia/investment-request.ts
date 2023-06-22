import { Customer } from '../../../app/models/bdb-generics/customer';
import { Account } from './account';

export class InvestmentRq {

  public accountFrom: Account;
  public accountTo: Account;
  public amt: string;

  constructor() {}
}
