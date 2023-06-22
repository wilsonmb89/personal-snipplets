import { Customer } from '../bdb-generics/customer';

export class AccountBalance {

  constructor(
    public productBank: string,
    public bankId: string,
    public productAlias: string,
    public productType: string,
    public productNumber: string,
    public productName: string,
    public description: string,
    public customer: Customer,
    public aval: boolean,
    public contraction: string,
    public productSubType?: string,
    public productNumberX?: string,
    public favorite?: boolean,
    public favoriteTime?: number,
    public franchise?: string
    ) {
  }
}

export interface AccountBalanceAval {
  amount: number;
  amount2: number;
  aval: boolean;
  description: string;
  description2: string;
  details: string;
  payments: any;
  productBank: string;
  productName: string;
  productNumber: string;
  productNumberX: string;
  productSubtype: string;
  productType: string;
}
