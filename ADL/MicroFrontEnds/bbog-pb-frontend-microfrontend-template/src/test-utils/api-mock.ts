import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const getProductsResponse = {
  accountList: [
    {
      productName: 'Cuenta de Ahorros LibreAhorro',
      description: 'AH Cuota Administración',
      officeId: '0019',
      productAthType: 'ST',
      productBankType: 'SDA',
      productBankSubType: '061AH',
      productNumber: '0019904804',
      status: 'A',
      valid: true,
      franchise: '',
      openDate: '2021-02-24'
    },
    {
      productName: 'Cuenta de Ahorros RentaAhorro',
      description: 'AH RentAhorro',
      officeId: '0000',
      productAthType: 'ST',
      productBankType: 'SDA',
      productBankSubType: '062AH',
      productNumber: '0000163824',
      status: 'A',
      valid: true,
      franchise: '',
      openDate: '2019-10-10'
    },
    {
      productName: 'Cuenta AFC',
      description: 'AH AFC',
      officeId: '0115',
      productAthType: 'AF',
      productBankType: 'SDA',
      productBankSubType: '067AH',
      productNumber: '0115026973',
      status: 'A',
      valid: true,
      franchise: '',
      openDate: '2019-10-10'
    },
    {
      productName: 'Cuenta de Ahorros LibreAhorro',
      description: 'AH Cuota Administración',
      officeId: '0019',
      productAthType: 'ST',
      productBankType: 'SDA',
      productBankSubType: '061AH',
      productNumber: '0019817337',
      status: 'A',
      valid: true,
      franchise: '',
      openDate: '2019-10-10'
    },
    {
      productName: 'Cuenta Corriente Comercial',
      description: 'CC Cuentas comerciales',
      officeId: '0019',
      productAthType: 'IM',
      productBankType: 'DDA',
      productBankSubType: '010CC',
      productNumber: '0019817386',
      status: 'A',
      valid: true,
      franchise: '',
      openDate: '2019-10-10'
    },
    {
      productName: 'Tarjeta de Crédito Platinum',
      description: 'MC Movistar  Platinum',
      officeId: '',
      productAthType: 'MC',
      productBankType: 'CCA',
      productBankSubType: '540080TC',
      productNumber: '5400800740196728',
      status: 'A',
      bin: '540080',
      valid: true,
      franchise: 'Mastercard',
      openDate: '2019-08-26'
    },
    {
      productName: 'Tarjeta de Crédito Platinum',
      description: 'MASTERCARD  Platinum',
      officeId: '',
      productAthType: 'MC',
      productBankType: 'CCA',
      productBankSubType: '552221TC',
      productNumber: '5522210168900044',
      status: 'A',
      bin: '552221',
      valid: true,
      franchise: 'Mastercard',
      openDate: '2019-08-26'
    },
    {
      productName: 'Tarjeta de Crédito Platinum',
      description: 'TC. Platinum Marcas Compartida',
      officeId: '',
      productAthType: 'CB',
      productBankType: 'CCA',
      productBankSubType: '403722TC',
      productNumber: '4037220001907925',
      status: 'A',
      bin: '403722',
      valid: true,
      franchise: 'Visa',
      openDate: '2019-08-26'
    },
    {
      productName: 'Tarjeta de Crédito Gold',
      description: 'VISA  Gold',
      officeId: '',
      productAthType: 'CB',
      productBankType: 'CCA',
      productBankSubType: '459918TC',
      productNumber: '4599186052891401',
      status: 'A',
      bin: '459918',
      valid: true,
      franchise: 'Visa',
      openDate: '2019-08-26'
    },
    {
      productName: 'CDT',
      description: 'CDT Vencido con vigencia',
      officeId: '1136',
      productAthType: 'CD',
      productBankType: 'CDA',
      productBankSubType: '200CDT',
      productNumber: '11360564654564',
      status: 'A',
      valid: true,
      franchise: '',
      openDate: '2019-10-11'
    }
  ]
};

export const getUserSettingsResponse = {
  customer: {
    identificationType: 'CC',
    identificationNumber: '2006699',
    risk: 'true',
    telephone: '3002659762',
    fullName: 'PRECIOSO ANTONIO OMAAA SOTO',
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

const server = setupServer(
  rest.post('/api-gateway/user-features/get-user-settings', (req, res, ctx) => res(ctx.json(getUserSettingsResponse))),
  rest.post('/api-gateway/products/get-all', (req, res, ctx) => res(ctx.json(getProductsResponse))),
  rest.post('/api-gateway/validation/validate-otp', (req, res, ctx) => res(ctx.json({ approvalId: '801084' }))),
  rest.post('/api-gateway/validation/validate-sim', (req, res, ctx) =>
    res(ctx.json({ phoneNumber: '3551', provider: 'Claro', isSecure: true, isValid: true }))
  ),
  rest.post('/api-gateway/validation/get-otp', (req, res, ctx) =>
    res(ctx.json({ message: 'Generate OTP Operation Success' }))
  ),
  rest.post('/api-gateway/setup/start', (req, res, ctx) =>
    res(
      ctx.text(
        `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyAltOcuBjRcS2Ix6sOKhXIMNO/9V+Ig8DEiDGNlMo87wsqEe5+rguei8cNxy1RNDJixdX+qpvfNQkMqkygzPMLRynWHzuQ/al/Q8mc0oXameW1aUax3fcUVtT61HWrxoq3LisIrTyrjl/hn/e40lIUBZNTQIpxJsp+9hv7PeJ/+e4Hy2vraXxEyH9TNQJWiQcdjaZuR71NNaRQ7Pivlzztlqvbv9/QQjEuTh6WrUE8blojCcz94J6ErTr34C939l0/Mkfvl+2dErDTSXayOOf+r5rV4B1BTupLH3o6JKy+Hy0n1PkczlGxvHBr+mQ/HubNNPeX2ku55nOH/33owRaQIDAQAB`
      ),
      ctx.set('Last-Modified:', '1625007226830')
    )
  )
);

export default server;
