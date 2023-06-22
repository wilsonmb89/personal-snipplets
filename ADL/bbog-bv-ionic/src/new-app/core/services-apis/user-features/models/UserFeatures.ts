
export interface UserFeatures {
  customer: Customer;
  settings: Settings;
  toggle: Toggle;
}

export interface Customer {
  identificationType: string;
  identificationNumber: string;
  remoteAddress: string;
  channel: string;
  terminalId: string;
}

export interface Settings {
  onBoarding: OnBoarding;
  amounts: Amounts;
  unicefCardRequested: boolean;
  greenCardRequested: boolean;
  privateMode: boolean;
  amtUnicefCampaignDash: number;
  amtMillionBanquetCampaignDash: number;
}

export interface OnBoarding {
  pockets: boolean;
  anyOtherService: boolean;
}


export interface Toggle {
  allowedServices: AllowedServices;
  allowedOTPServices: AllowedOTPServices;
}

export interface AllowedServices {
  pockets: boolean;
  activateTD: boolean;
  dianTaxPayment: boolean;
  pqrInquiry: boolean;
  enableSetCardPin: boolean;
  cardsSecurity: boolean;
  toggleTC: boolean;
  facilpass: boolean;
  setCCPin: boolean;
  crossSellSavingAccountSDA: boolean;
  crossSellCreditCardCCA: boolean;
  crossSellMortgageCreditDLA: boolean;
  crossSellCreditService568: boolean;
  crossSellCreditLOC: boolean;
  crossSellLifeInsurance678: boolean;
  crossSellCDTCDA: boolean;
  crossSellFiduciaryFDA: boolean;
  crossSellPortfolioPurchase: boolean;
  extraordinaryPaymentCredit: boolean;
  helpCenter: boolean;
  scheduledTransfers: boolean;
  betweenAccounts: boolean;
  cashAdvance: boolean;
}
export interface AllowedOTPServices {
  accountInscription: boolean;
  accountTransfer: boolean;
  billInscription: boolean;
  billPayment: boolean;
  creditCardInscription: boolean;
  creditCardPayment: boolean;
  creditInscription: boolean;
  creditPayment: boolean;
  pilaPayment: boolean;
  taxPayment: boolean;
  recharges: boolean;
  updateData: boolean;
  limitChanges: boolean;
  limitChangeNationalAccount: boolean;
  login: boolean;
  debitCardActivation: boolean;
  creditCardActivation: boolean;
}

export interface Amounts {
  maxAmountBeforeRequestSecurity: number;
}
