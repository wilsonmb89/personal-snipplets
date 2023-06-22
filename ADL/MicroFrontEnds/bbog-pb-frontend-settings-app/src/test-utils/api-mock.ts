import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const getLimitsResponse = {
  bankLimit: [
    { channel: 'AVP', desc: 'Compras Aval Pay con T. Débito', amount: '200000', count: '5' },
    { channel: 'BM', desc: 'Banca Móvil', amount: '2000000', count: '10' },
    { channel: 'CNB', desc: 'Corresponsales No Bancarios', amount: '900000', count: '3' },
    { channel: 'CTD', desc: 'Compras Virtuales con T. Débito', amount: '1000000', count: '10' },
    { channel: 'PB', desc: 'Internet', amount: '1000000', count: '10' },
    { channel: 'IVR', desc: 'Servilinea', amount: '0', count: '0' },
    { channel: 'AUT', desc: 'Cajeros Automáticos', amount: '16000001', count: '1000' },
    { channel: 'AGI', desc: 'Depositario de Cheques', amount: '16000001', count: '1000' },
    { channel: 'PIN', desc: 'Pin Pad', amount: '16000001', count: '1000' },
    { channel: 'AVA', desc: 'Oficina Aval', amount: '16000001', count: '1000' },
    { channel: 'PSE', desc: 'Pagos Virtuales(PSE y Pagos AVAL)', amount: '0', count: '0' },
    { channel: 'AGE', desc: 'Agilizador Eletrónico', amount: '16000001', count: '1000' }
  ]
};

export const getProductsResponse = {
  accountList: [
    {
      productName: 'Cuenta AFC',
      description: 'AH AFC',
      officeId: '0190',
      productAthType: 'AF',
      productBankType: 'SDA',
      productBankSubType: '067AH',
      productNumber: '0190109892',
      valid: true,
      franchise: '',
      openDate: '2019-10-10'
    },
    {
      productName: 'Cuenta Corriente Comercial',
      description: 'CC Cuentas comerciales',
      officeId: '0023',
      productAthType: 'IM',
      productBankType: 'DDA',
      productBankSubType: '010CC',
      productNumber: '0023051352',
      valid: true,
      franchise: '',
      openDate: '2020-03-11'
    },
    {
      productName: 'Tarjeta de Crédito Black',
      description: 'MASTERCARD BLACK',
      officeId: '',
      productAthType: 'MC',
      productBankType: 'CCA',
      productBankSubType: '553661TC',
      productNumber: '5536610804445938',
      bin: '553661',
      valid: true,
      franchise: 'Mastercard',
      openDate: '2020-07-27'
    }
  ]
};

const server = setupServer(
  rest.post('/api-gateway/products/get-all', (req, res, ctx) => res(ctx.json(getProductsResponse))),
  rest.post('/api-gateway/customer-security/get-limits', (req, res, ctx) => res(ctx.json(getLimitsResponse))),
  rest.post('/api-gateway/customer-security/get-limits-nat-acc', (req, res, ctx) =>
    res(ctx.json({ bankLimit: [{ amount: '80000000', trnCode: '0320', typeField: null }] }))
  ),
  rest.post('/api-gateway/user-features/get-catalog', (req, res, ctx) =>
    res(ctx.json({ catalogItems: [{ id: 'ACCOUNT_TOP_LIMIT', name: '50000000', catalogName: 'LIMITS_BOUNDS' }] }))
  ),
  rest.post('/api-gateway/validation/token/info', (req, res, ctx) =>
    res(
      ctx.json({
        id: '31231',
        status: 'Activo',
        type: 'Mobile'
      })
    )
  ),
  rest.post('/api-gateway/validation/validate-otp', (req, res, ctx) =>
    res(
      ctx.json({
        approvalId: '801084'
      })
    )
  ),
  rest.post('/api-gateway/customer-security/edit-limits-nat-acc', (req, res, ctx) =>
    res(ctx.json({ message: 'Operation success', approvalId: '430841' }))
  ),
  rest.post('/api-gateway/customer-security/edit-limits', (req, res, ctx) =>
    res(ctx.json({ message: 'Operation success', approvalId: '430841' }))
  ),
  rest.post('/login', (req, res, ctx) => res(ctx.json({ message: 'Operation success', approvalId: '430841' }))),
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
