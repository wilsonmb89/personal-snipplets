export interface GetAffiliatedAccountsRs {
  acctBalancesList: AffiliatedAccount[];
}

export interface AffiliatedAccount {
  productBank: string;
  bankId: string;
  aval: boolean;
  productAlias: string;
  productName: string;
  productType: string;
  productNumber: string;
  description: string;
  priority: string;
  customer: Customer;
  contraction: string;
}

interface Customer {
  identificationType: string;
  identificationNumber: string;
  name?: string;
}
