export interface GetBalanceRs {
  productBalanceInfoList: Array<ProductBalanceInfo>;
}

export interface ProductBalanceInfo {
  accountId: string;
  accountType: string;
  status?: string;
  expDate: string;
  balanceDetail: any;

  // fiduciary
  canRecId?: string;
  name?: string;

  // loan
  loanName?: string;
  nextPmtCurAmt?: string;
  dueDt?: string;
  openDt?: string;
  upDt?: string;
  feeDetails?: any;

  // demand
  overdraftDays?: string;

  // credit-card
  minPmtCurAmt?: string;

}


export interface FiduciaryBalanceInfo extends ProductBalanceInfo {
  canRecId: string;
  name: string;
}

export interface LoanBalanceInfo extends ProductBalanceInfo {
  loanName: string;
  nextPmtCurAmt: string;
  dueDt: string;
  feeDetails: any;
}

export interface DemandBalanceInfo extends ProductBalanceInfo {
  overdraftDays: string;
}

export interface CreditCardBalanceInfo extends ProductBalanceInfo {
  dueDt: string;
  minPmtCurAmt: string;
}
