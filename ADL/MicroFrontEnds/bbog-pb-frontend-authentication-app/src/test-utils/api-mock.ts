import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const getUserSettingsResponse = {
  customer: {
    identificationType: 'CC',
    identificationNumber: '2006699',
    risk: 'true',
    telephone: '3002659762',
    fullName: 'ANTONIO OMAAA SOTO',
    remoteAddress: '190.25.122.66, 64.252.186.143, 10.95.26.237',
    channel: 'PB',
    terminalId: 'IN01',
    backendToken:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpZGVudGl0eVR5cGUiOiJDIiwiaWRlbnRpdHlOdW1iZXIiOiIyMDA2Njk5IiwiZGF0ZWluaXRpYWwiOiIyMDIxLTA5LTIzVDIwOjE3OjAwIn0.LN3fKmRLXjtyBVgxZHe0vVz1pTolPJrnCQFFIe8oDIo0k1xShmLSqtGky0wbdUe7s3NdrhD34YbCb1U-6GC_d53HfBzI8dgQ3WrbfeTJEt5T-_wCWsGoygreXebgmx9wVPjufjH9VnIEjsvMhGdoECUzqJCiARNyziwVcG0p5mk',
    email: 'jpesba@gmail.com',
    sessionId: '3FEA265A4CC1BCC1503FB4335FAECC0D',
    authVersion: '2'
  },
  settings: {
    onBoarding: { pockets: false, anyOtherService: false },
    amounts: { maxAmountBeforeRequestSecurity: 50000000 },
    privateMode: false,
    unicefCardRequested: false,
    greenCardRequested: false,
    amtUnicefCampaignDash: 10,
    amtMillionBanquetCampaignDash: 2
  },
  toggle: {
    allowedServices: {
      pockets: true,
      activateTD: false,
      dianTaxPayment: true,
      pqrInquiry: true,
      enableSetCardPin: true,
      cardsSecurity: true,
      toggleTC: true,
      newAuthFlow: true,
      setCCPin: true,
      facilpass: true,
      extraordinaryPaymentCredit: true,
      crossSellSavingAccountSDA: true,
      crossSellCreditCardCCA: true,
      crossSellMortgageCreditDLA: true,
      crossSellCreditService568: true,
      crossSellCreditLOC: true,
      crossSellLifeInsurance678: true,
      crossSellCDTCDA: true,
      crossSellFiduciaryFDA: false
    },
    allowedOTPServices: {
      accountInscription: true,
      accountTransfer: true,
      billInscription: true,
      billPayment: true,
      creditCardInscription: true,
      creditCardPayment: true,
      creditInscription: true,
      creditPayment: true,
      pilaPayment: true,
      taxPayment: true,
      recharges: true,
      updateData: false,
      limitChanges: false,
      limitChangeNationalAccount: false,
      debitCardActivation: true,
      creditCardActivation: true
    },
    allowedOTPServicesV2: {
      accountInscription: { otpByCall: true, otpBySms: true },
      accountTransfer: { otpByCall: true, otpBySms: true },
      billInscription: { otpByCall: true, otpBySms: true },
      billPayment: { otpByCall: true, otpBySms: true },
      creditCardInscription: { otpByCall: true, otpBySms: true },
      creditCardPayment: { otpByCall: true, otpBySms: true },
      creditInscription: { otpByCall: true, otpBySms: true },
      creditPayment: { otpByCall: true, otpBySms: true },
      pilaPayment: { otpByCall: true, otpBySms: true },
      taxPayment: { otpByCall: true, otpBySms: true },
      recharges: { otpByCall: true, otpBySms: true },
      updateData: { otpByCall: false, otpBySms: false },
      limitChanges: { otpByCall: false, otpBySms: false },
      limitChangeNationalAccount: { otpByCall: false, otpBySms: false },
      debitCardActivation: { otpByCall: true, otpBySms: true },
      creditCardActivation: { otpByCall: true, otpBySms: true },
      paymentsGatewayExecutePayment: { otpByCall: false, otpBySms: false }
    },
    amounts: { maxAmountBeforeRequestSecurity: 50000000 }
  }
};

export const authResponse = {
  accessToken:
    'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.ibn7eekRxSU6h7Ps5S7op7VknFQU_sOqbILO-PBS7Bxcuh0NkouzRxZW2MOO9isOuT5UqbAKVZ7TITYDuWRpefe9FIV_HZ_ZdAg-t2Mo4IrdY6_kZJf7UK4aHbgNq5BOEn87XvJ2A3d2MUjoyR88Am6BRzdWnSDgZrE9vSM51qnMV-QPiae5nSB5XMxvmvLZJfIqTujZoFDwbaEZ_ntS3_z1gBWQZBls-L6WeNrPYierLNHC08Tvuc36Yp2SXdN9o0Y0eiVGUrJ3F5uySuN0xTR9QGY0PnxbCgHGcFn_Gc3RA6nammrGJK8rUk8L2c5l6l33NvLTCaWMrLhapyxeiQ.R10eb-rYrYTXQwRa.ieacii_OOdIQwnTvlPnp7o-zIty8Z1qdeCV4FfBxRug97UiI_dZ7dkuxq27teBoG1LNVwc5MixM4MdCvNNKEbIDkCNqS5g4_kK8nZtWB6UiMH428Coz_vhGt1VRCTUZmdv_p05M2IVlobNC4hOixf-JO2aWvZDxQnmzTh3O_ebe9pOEnhdx95hU_q-4OZdMUFXRD1cYy6bj6ZYp9ouXPONGK-a3sSVAPKEXnLFQozoqilRYacz-AWkLRV5jtMt1IijJNGMrvurn5kyeeYlKoupsVn7Q6ebPEgBtGlvdvRhT-sUNceoFpbj8kIn2Q5OuJR3wnG99MekeBl6PrQlC1n3FATO8rkTmToXC2t_yi2qn3gfEHUOPO316pdJm3NfjYFQiA5vBkpcrMl7iB0mDR0UxO56ECwpl_ZBhxfSHQMUSGBk3WBlAzsyV3FVudi8D42ZD4zWSWViaOehkCCGxhTzobFtXXKDqEhQssS_ArZdhhXshkG-F_0hD38sUm3nz-TZdnSWBTQI4B8vdh5C-UK_jgOX-4i0EAFkRBq5HT80d8FpH7JSfCXhWOn1lVpscLe4FxLN1IFj-dILCmwPBdwo8K8ms9HoW2jzS22yyLfGmqnF73IkjaogtPGTmKJd0PxTt4BvKclvgrLuW5BiSBKtsx-tcMhnHAzPxTO2sdoscm-kYW6b9xvCno24F6PaKYI5iwfS8Zj-Oi449E0j5mqhhn5H3IS3KVtMNC8cy8PqtBAPJdtSEUegCyrPvE2yVjAcPOVynpgyyEOrPApR56zNa7gkJ2YFe7Zgs2blxpckK-HD5qpb2PC8A9UmxYU_c_RDs1q_o_KovnxCUll8t7I83aBDvhY6PWDFWHZ8uu03q-7C5ybS4QWaadKE-aFaBEdUWKKt5yDNu-S045hB4Mv1sDQ8-s91R4Ed-l9fxgStlg8D00WCnjQL7YT3XZAZBW_mLX6NlfOQGCz_jUh_QTCSbT_klK_aAubGxH2PE63sqmsY0VUl3d9QPRNWmRiDb3y8aOUX9Elu4XLKyhgdRJzXA1h_RB8skYFpuIMNO5SJzlMVatVmVDOQ7xcHB_63JU7alVbeO7-j-g5VTVSyA4GNSRa-4lHQB-dySCYcJsjSlUHhtYdM7iaqdBK0812IOzfqFXB9HdbqRQ1tJb2osj1Vkhua0XB10xXuX7pcOy6LMhaMhhRU6L-LltPoEzfcigk-Y_kNIIJVg26iPcj4UpTuFSFNIaHQiJOmiEirxxcN6Iz9ysEoK49h9M6y099-Z9GxeGqzsoPIFt2ogY2HQHeHe3r8L9RcEgRrlrDQYf_DEA5ow5l6U_iVn6IQ.g2qyUpoYf1MEIQTGf2DuyA',
  tokenBank:
    'mock_eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..IKF8SLXwfpC0nBWVqp2Npw.vhsesB9EU6Uqq6b5U7mdBAEwvSIznjTaEOLDWTD5BzzwN1G3bSll6Lb66LS3R7KacpNbjjOMmffDtRSM51wQYg.sMzpmtuU6bS78hSYdU013Q',
  fullName: 'SOFIA PEREZ OZA',
  identificationNumber: '2006698',
  identificationType: 'CC',
  telephone: '3222523745',
  email: 'jorge.castillo@avaldigitallabs.com',
  sessionId: 'BAAC0FE9FF14111667A631436056ABB2',
  hasActiveToken: true,
  actionCode: 'ALLOW',
  tokenVersion: '2',
  secureSiteKey: '801084',
  cdtOwner: false
};

export const authChallengeResponse = {
  data: {
    originComponent: 'authentication',
    backendErrorMessage: 'RSA is requesting to user with idType: CC and idNumber: 2006699 to be challenged',
    businessErrorCode: 'CHALLENGE',
    serverStatusCode: 'CHALLENGE',
    errorMessage:
      'There was a business error processing this request, as follows : RSA is requesting to user with idType: CC and idNumber: 2006699 to be challenged',
    customDetails: {
      rsaRetryCorrelationId: 'fffc3d37-1b8d-49a8-8fcd-15cb7ce7a6a0'
    },
    customerErrorMessage: {
      title: 'Transacción Fallida',
      message: 'En estos momentos no es posible procesar la transacción. Por favor inténtalo más tarde',
      alertType: 'AlertsMessagesType.GENERIC_WARNING'
    }
  }
};

export const authErrorResponse = {
  data: {
    originComponent: 'authentication',
    backendErrorMessage: 'Error Generico',
    businessErrorCode: '100',
    serverStatusCode: '1',
    errorMessage:
      'There was a business error processing this request, as follows : Manager response references business error as follows: {"originComponent":"customer-basic-data","backendErrorMessage":"Error Generico","businessErrorCode":"100","serverStatusCode":"1","errorMessage":"There was a business error processing this request, as follows : Api Connect response references business error with code : 100, server status code: 1 and message : Error Generico, with details: Cliente No Existe.","customerErrorMessage":{"title":"Transacción Fallida","message":"En estos momentos no es posible procesar la transacción. Por favor inténtalo más tarde","alertType":"AlertsMessagesType.GENERIC_WARNING"}}',
    customerErrorMessage: {
      title: 'Transacción Fallida',
      message: 'En estos momentos no es posible procesar la transacción. Por favor inténtalo más tarde',
      alertType: 'AlertsMessagesType.GENERIC_WARNING'
    }
  }
};

export const getTermsAndConditionsResponse = {
  termsAndConditionsV1: false
};

export const customerData = {
  identificationType: 'CC',
  identificationNumber: '2006699',
  remoteAddress: '1.1.1.1',
  channel: 'PB',
  terminalId: '01'
};

const registerBasicData = {
  isCustomer: true,
  hasSecureKey: true,
  hasProducts: true,
  name: 'Alejandro',
  phone: '0909',
  email: 'email@gmail.com'
};

export const getRegisterBasicDataRes = {
  forget: {
    ...registerBasicData
  },
  register: {
    ...registerBasicData,
    hasSecureKey: false
  },
  notCustomer: {
    ...registerBasicData,
    isCustomer: false
  },
  notSecureData: {
    ...registerBasicData,
    phone: ''
  },
  noActiveProducts: {
    ...registerBasicData,
    hasProducts: false
  }
};

export const otpAuthResponse = {
  accessToken: '4a567pSb-3g9JkcYeE-Ci0lXfqw.sfygRrhC0mgqu9jRoB3SHQ',
  sessionId: 'D73B06427F831C32B6C7A65A042066F0',
  tokenVersion: '2',
  cdtOwner: false
};

export const getValidProductsTDRes = {
  validationProductInfoList: [
    {
      productNumber: '0000050000041355',
      productType: 'DEB',
      iterations: '34876',
      last4Digits: '1355'
    }
  ]
};

export const getValidProductsCDTRes = {
  validationProductInfoList: [
    {
      productNumber: '3CetXUgXo3P4cn3pxxNv8+Zmc47AT63pM3A+o37QzUvxKWfZOEru98MgQy7XMnmTSW+nkX9dYZQSq+1rXFo63w==',
      productType: 'CCA',
      iterations: '19059',
      last4Digits: '1234'
    }
  ]
};

export const login = jest.fn().mockImplementation(() => Promise.resolve({ data: authResponse }));

const server = setupServer(
  rest.post('/api-gateway/user-features/get-terms-and-conditions', (req, res, ctx) =>
    res(ctx.json(getTermsAndConditionsResponse))
  ),
  rest.post('/api-gateway/user-features/get-user-settings', (req, res, ctx) => res(ctx.json(getUserSettingsResponse))),
  rest.post('/api-gateway/user-features/user-settings', (req, res, ctx) => res(ctx.json(getUserSettingsResponse))),
  rest.post('/api-gateway/register-unchecked/get-register-basic-data', (req, res, ctx) =>
    res(ctx.json(getRegisterBasicDataRes.notCustomer))
  ),
  rest.post('/api-gateway/register-unchecked/get-otp', (req, res, ctx) =>
    res(ctx.json({ message: 'Operation Success' }))
  ),
  rest.post('/api-gateway/authentication/v3/otp-auth', (req, res, ctx) => res(ctx.json(otpAuthResponse))),
  rest.post('/api-gateway/register-checked/get-validation-products', (req, res, ctx) =>
    res(ctx.json(getValidProductsTDRes))
  ),
  rest.post('/api-gateway/register-checked/validate-pin', (req, res, ctx) =>
    res(ctx.json({ message: 'Operation Success' }))
  ),
  rest.post('/api-gateway/register-checked/v2/set-secure-key', (req, res, ctx) =>
    res(ctx.json({ message: 'Operation Success' }))
  ),
  rest.post('/api-gateway/register-checked/v2/reset-secure-key', (req, res, ctx) =>
    res(ctx.json({ message: 'Operation Success' }))
  )
);

export default server;
