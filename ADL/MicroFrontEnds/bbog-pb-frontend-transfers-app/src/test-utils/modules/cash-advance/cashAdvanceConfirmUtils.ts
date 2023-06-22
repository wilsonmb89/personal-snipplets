import { Product } from '@store/products/products.entity';

export const confirmCardSelected: Product = {
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
  openDate: '2019-08-26',
  balanceInfo: {
    accountId: '5522210168900044',
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

export const confirmDestinationAmount: Product = {
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
  openDate: '2019-10-10',
  balanceInfo: {
    accountId: '0000000000163824',
    accountType: 'SDA',
    status: '00',
    balanceDetail: {
      Avail: '849000.93',
      CashAvail: '0.00',
      PendAuthAmt: '0.00',
      CashLimit: '0.00',
      Current: '12410051.93'
    }
  }
};
