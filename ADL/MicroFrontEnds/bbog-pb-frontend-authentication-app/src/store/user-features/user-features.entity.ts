export interface TermsAndConditionsItem {
  version: string;
  acceptedDate: string;
}

export interface SettingsTermsAndConditions {
  settings: { termsAndConditions: TermsAndConditionsItem[] };
}

export const initialStateTerms: TermsAndConditionsItem[] = [];

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
  backendToken: string;
  sessionId: string;
  authVersion: string;
}

export interface Settings {
  termsAndConditions: TermsAndConditionsItem[];
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
  newAuthFlow: boolean;
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

export const initialState: UserFeatures = {
  customer: {
    identificationType: null,
    identificationNumber: null,
    remoteAddress: null,
    channel: null,
    terminalId: null,
    backendToken: null,
    sessionId: null,
    authVersion: null
  },
  settings: {
    onBoarding: null,
    termsAndConditions: null,
    amounts: null,
    privateMode: null,
    unicefCardRequested: null,
    greenCardRequested: null,
    amtUnicefCampaignDash: null,
    amtMillionBanquetCampaignDash: null
  },
  toggle: {
    allowedServices: {
      pockets: null,
      activateTD: null,
      dianTaxPayment: null,
      pqrInquiry: null,
      enableSetCardPin: null,
      cardsSecurity: null,
      toggleTC: null,
      facilpass: null,
      setCCPin: null,
      crossSellSavingAccountSDA: null,
      crossSellCreditCardCCA: null,
      crossSellMortgageCreditDLA: null,
      crossSellCreditService568: null,
      crossSellCreditLOC: null,
      crossSellLifeInsurance678: null,
      crossSellCDTCDA: null,
      crossSellFiduciaryFDA: null,
      crossSellPortfolioPurchase: null,
      extraordinaryPaymentCredit: null,
      helpCenter: null,
      scheduledTransfers: null,
      betweenAccounts: null,
      newAuthFlow: null
    },
    allowedOTPServices: {
      accountInscription: null,
      accountTransfer: null,
      billInscription: null,
      billPayment: null,
      creditCardInscription: null,
      creditCardPayment: null,
      creditInscription: null,
      creditPayment: null,
      pilaPayment: null,
      taxPayment: null,
      recharges: null,
      updateData: null,
      limitChanges: null,
      limitChangeNationalAccount: null,
      debitCardActivation: null,
      login: null,
      creditCardActivation: null
    }
  }
};
