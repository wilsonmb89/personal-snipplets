export interface GetBalanceRq {
  productsInfo: Array<ProductInfo>;
}

export interface ProductInfo {
  acctId: string;
  acctType: string;
  acctSubType: string;
  officeId: string;
  refType: string;
  refId: string;
}
