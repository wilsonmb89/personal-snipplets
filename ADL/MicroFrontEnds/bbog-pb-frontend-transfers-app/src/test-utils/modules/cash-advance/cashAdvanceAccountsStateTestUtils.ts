import { Product } from '@store/products/products.entity';

export const productsAccountsListState: Product[] = [
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
    openDate: '2021-02-24',
    balanceInfo: {
      accountId: '0000000019904804',
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
    openDate: '2019-10-10',
    balanceInfo: {
      accountId: '0000000019817337',
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
  }
];

export const onlyProductAccountsListState: Product[] = [
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
    openDate: '2021-02-24',
    balanceInfo: {
      accountId: '0000000019904804',
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
  }
];
