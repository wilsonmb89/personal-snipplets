export interface UserFeatures {
  customer: Customer;
  settings: Settings;
  toggle: Toggle;
}

export interface Toggle {
  allowedServices: AllowedServices;
  allowedOTPServices: AllowedOTPServices;
  amounts: Amounts;
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
  debitCardActivation: boolean;
  creditCardActivation: boolean;
}

export interface AllowedServices {
  pockets: boolean;
  activateTD: boolean;
  dianTaxPayment: boolean;
  pqrInquiry: boolean;
  enableSetCardPin: boolean;
  cardsSecurity: boolean;
  toggleTC: boolean;
  newAuthFlow: boolean;
}

export interface Settings {
  onBoarding: OnBoarding;
  amounts: Amounts;
  privateMode: boolean;
  unicefCardRequested: boolean;
  greenCardRequested: boolean;
  amtUnicefCampaignDash: number;
  amtMillionBanquetCampaignDash: number;
}

export interface Amounts {
  maxAmountBeforeRequestSecurity: number;
}

export interface OnBoarding {
  pockets: boolean;
  anyOtherService: boolean;
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
      creditCardActivation: null
    },
    amounts: {
      maxAmountBeforeRequestSecurity: null
    }
  }
};
