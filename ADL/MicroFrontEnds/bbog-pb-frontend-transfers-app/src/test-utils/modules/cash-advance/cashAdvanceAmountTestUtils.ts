import { Product } from '@store/products/products.entity';

export const cardSelected: Product = {
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
  openDate: '2019-08-26',
  balanceInfo: {
    accountId: '5400800740196728',
    accountType: 'CCA',
    balanceDetail: {
      CashAvail: '5844092.00',
      CreditLimit: '10000000.00',
      AvailCredit: '9844092.00',
      PayoffAmt: '155908.00',
      Principal: '9844092.00'
    },
    minPmtCurAmt: '0.00'
  }
};
