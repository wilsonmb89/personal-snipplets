import { DEFAULT_TRANSACTION_COST } from '@cash-advance/constants/utilsConstants';
import { Product } from '@store/products/products.entity';

export const productsMock: Product[] = [
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
    openDate: '2019-10-10',
    balanceInfo: {
      accountId: '0000000115026973',
      accountType: 'SDA',
      status: '00',
      balanceDetail: {
        Avail: '0.0',
        CashAvail: '0.00',
        PendAuthAmt: '0.00',
        CashLimit: '0.00',
        Current: '0.0'
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
    openDate: '2019-10-10',
    balanceInfo: {
      accountId: '0000000019817386',
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
    status: 'P',
    bin: '540080',
    valid: true,
    franchise: 'Mastercard',
    openDate: '2019-08-26',
    balanceInfo: {
      accountId: '4037220001907925',
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
    openDate: '2019-08-26',
    balanceInfo: {
      accountId: '4037220001907925',
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
  },
  {
    productName: 'Tarjeta de Crédito Gold',
    description: 'VISA  Gold',
    officeId: '',
    productAthType: 'CB',
    productBankType: 'CCA',
    productBankSubType: '459918TC',
    productNumber: '4599186052891401',
    status: 'P',
    bin: '459918',
    valid: true,
    franchise: 'Visa',
    openDate: '2019-08-26',
    balanceInfo: {
      accountId: '4599186052891401',
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
  },
  {
    productName: 'Tarjeta de Crédito Gold 3',
    description: 'VISA  Gold',
    officeId: '',
    productAthType: 'CB',
    productBankType: 'CCA',
    productBankSubType: '459918TC',
    productNumber: '4599186052891404',
    status: 'A',
    bin: '459918',
    valid: true,
    franchise: 'VisaTest',
    openDate: '2019-08-26',
    balanceInfo: {
      accountId: '4037220001907925',
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
  },
  {
    productName: 'Crédito',
    description: 'M/L  Crédito Sobre el Exterior',
    officeId: '0000',
    productAthType: 'AD',
    productBankType: 'LOC',
    productBankSubType: '540ML',
    productNumber: '00559606897',
    status: 'A',
    valid: true,
    franchise: '',
    openDate: '2022-04-01'
  },
  {
    productName: 'Crédito de Vivienda',
    description: 'M/L  Crédito Empleados Viviend',
    officeId: '0943',
    productAthType: 'AV',
    productBankType: 'LOC',
    productBankSubType: '830ML',
    productNumber: '00559608190',
    status: 'A',
    valid: true,
    franchise: '',
    openDate: '2022-04-06'
  },
  {
    productName: 'Crédito de Vivienda',
    description: 'M/L  Crédito Empleados Viviend',
    officeId: '0943',
    productAthType: 'AV',
    productBankType: 'LOC',
    productBankSubType: '810ML',
    productNumber: '00559608118',
    status: 'A',
    valid: true,
    franchise: '',
    openDate: '2022-04-06'
  },
  {
    productName: 'Crédito de Vivienda',
    description: 'M/L  Crédito Empleados Viviend',
    officeId: '0943',
    productAthType: 'AV',
    productBankType: 'LOC',
    productBankSubType: '840ML',
    productNumber: '00559608207',
    status: 'A',
    valid: true,
    franchise: '',
    openDate: '2022-04-06'
  },
  {
    productName: 'Crédito de Vivienda',
    description: 'M/L  Crédito Empleados Viviend',
    officeId: '0943',
    productAthType: 'AV',
    productBankType: 'LOC',
    productBankSubType: '820ML',
    productNumber: '00559608181',
    status: 'A',
    valid: true,
    franchise: '',
    openDate: '2022-04-06'
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
];

export const cashAdvanceWorkflowStateMock = {
  step: 2,
  cardSelected: {
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
    openDate: '2019-08-26',
    balanceDetail: {
      CashAvail: '4842096.33',
      CreditLimit: '5000000.00',
      AvailCredit: '4842096.33',
      Outstanding: '0.00',
      PayoffAmt: '157904.00',
      Principal: '4842096.33'
    }
  },
  advanceAmount: '1.000',
  destinationAcct: {
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
    balanceDetail: {
      totalBBOG: '90693529.50',
      canjeBBOG: '0.00',
      disponibleBBOG: '90693529.50'
    }
  },
  transactionCost: DEFAULT_TRANSACTION_COST,
  directAccess: null,
  fetchApiResult: null
};

export const cardsInfoMockData = [
  {
    cardState: 'P',
    cardNumber: '7777670002006698',
    lastDigits: '02006698',
    displayNumber: '****6698',
    expDate: '2050-01-01T19:38:41.000+0000',
    cardType: 'PRIV',
    description: 'No definida'
  },
  {
    cardState: 'P',
    cardNumber: '4915110202314574',
    lastDigits: '02314574',
    displayNumber: '****4574',
    expDate: '2050-01-01T19:38:41.000+0000',
    cardType: 'DEB',
    description: 'Visa Electron'
  },
  {
    cardState: 'H',
    cardNumber: '5400800740196728',
    lastDigits: '40196728',
    displayNumber: '****6728',
    expDate: '2050-01-01T19:38:41.000+0000',
    cardType: 'CRE',
    description: 'Mastercard Movistar Platinum',
    lockId: 'UNDEFINED'
  },
  {
    cardState: 'P',
    cardNumber: '4037220001907925',
    lastDigits: '01907925',
    displayNumber: '****7925',
    expDate: '2050-01-01T19:38:41.000+0000',
    cardType: 'CRE',
    description: 'Visa Platinum',
    lockId: 'UNDEFINED'
  },
  {
    cardState: 'H',
    cardNumber: '4599186052891401',
    lastDigits: '52891401',
    displayNumber: '****1401',
    expDate: '2050-01-01T19:38:41.000+0000',
    cardType: 'CRE',
    description: 'Visa Gold',
    lockId: 'UNDEFINED'
  },
  {
    cardState: 'H',
    cardNumber: '5522210168900044',
    lastDigits: '68900044',
    displayNumber: '****0044',
    expDate: '2050-01-01T19:38:41.000+0000',
    cardType: 'CRE',
    description: 'Mastercard Platinum',
    lockId: 'UNDEFINED'
  }
];
