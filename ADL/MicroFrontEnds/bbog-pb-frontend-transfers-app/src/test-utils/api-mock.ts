import { setupServer } from 'msw/node';
import { MockedRequest, rest } from 'msw';
import { TRANSFER_COUNT_TYPE } from '../modules/scheduled-transfers/constants/schedule-transfers';
import { CATALOG_NAME } from '../constants/catalog-names';
import { ProductTypes } from '../constants/bank-codes';
import { GetCatalogRq } from '../store/catalogs/catalogs.entity';
import { DEFAULT_TRANSACTION_COST } from '@cash-advance/constants/utilsConstants';

export const getAffiliatedAcctsResponse = {
  acctBalancesList: [
    {
      productBank: 'BANCO DE BOGOTA',
      bankId: '001',
      aval: true,
      productName: 'tet                      ',
      productAlias: 'tet',
      productType: 'DDA',
      productNumber: '00000000114136872',
      description: 'Corriente',
      priority: '1',
      customer: { identificationNumber: '2006699' },
      contraction: 'T'
    },
    {
      productBank: 'BANCO DE BOGOTA',
      bankId: '001',
      aval: true,
      productName: 'Nit 8604681735           ',
      productAlias: 'Nit 8604681735',
      productType: 'SDA',
      productNumber: '00000000000331223',
      description: 'Ahorros',
      priority: '1',
      customer: { identificationType: 'NJ', identificationNumber: '8604681735' },
      contraction: 'N'
    },
    {
      productBank: 'BANCO DE BOGOTA',
      bankId: '001',
      aval: true,
      productName: 'Test BDB                 ',
      productAlias: 'Test BDB 2006698',
      productType: 'SDA',
      productNumber: '00000000041481888',
      description: 'Ahorros',
      priority: '1',
      customer: { identificationType: 'CC', identificationNumber: '2006698' },
      contraction: 'TB'
    },
    {
      productBank: 'BANCO DE BOGOTA',
      bankId: '001',
      aval: true,
      productName: 'okokoko                  ',
      productAlias: 'okokoko',
      productType: 'SDA',
      productNumber: '00000000047415161',
      description: 'Ahorros',
      priority: '1',
      customer: { identificationNumber: '19902734' },
      contraction: 'O'
    },
    {
      productBank: 'BANCO DE BOGOTA',
      bankId: '001',
      aval: true,
      productName: 'Refresh Droid            ',
      productAlias: 'Refresh droid',
      productType: 'SDA',
      productNumber: '00000000056364243',
      description: 'Ahorros',
      priority: '1',
      customer: { identificationType: 'CC', identificationNumber: '19902736' },
      contraction: 'RD'
    },
    {
      productBank: 'BANCO DE BOGOTA',
      bankId: '001',
      aval: true,
      productName: 'jp                       ',
      productAlias: 'jp',
      productType: 'SDA',
      productNumber: '00000000115027518',
      description: 'Ahorros',
      priority: '1',
      customer: { identificationType: 'CC', identificationNumber: '9878886' },
      contraction: 'J'
    },
    {
      productBank: 'BANCO DE BOGOTA',
      bankId: '001',
      aval: true,
      productName: 'Prueba BDB               ',
      productAlias: 'Pruebas BDB',
      productType: 'SDA',
      productNumber: '00000000180577926',
      description: 'Ahorros',
      priority: '1',
      customer: { identificationType: 'CC', identificationNumber: '6999999' },
      contraction: 'PB'
    },
    {
      productBank: 'BANCO POPULAR',
      bankId: '002',
      aval: true,
      productName: 'Btn pop                  ',
      productAlias: 'Btn pop',
      productType: 'SDA',
      productNumber: '00000000739003523',
      description: 'Ahorros',
      priority: '2',
      customer: { identificationType: 'CC', identificationNumber: '19902736' },
      contraction: 'BP'
    },
    {
      productBank: 'BANCO ITAU CORPBANCA COLOMBIA',
      bankId: '006',
      aval: false,
      productName: 'Itau Review              ',
      productAlias: 'Itau Review',
      productType: 'SDA',
      productNumber: '569302',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '678392' },
      contraction: 'IR'
    },
    {
      productBank: 'BANCO ITAU CORPBANCA COLOMBIA',
      bankId: '006',
      aval: false,
      productName: 'Paketon Itau             ',
      productAlias: 'Paketon Itau',
      productType: 'SDA',
      productNumber: '675839',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '6789890' },
      contraction: 'PI'
    },
    {
      productBank: 'BANCO ITAU CORPBANCA COLOMBIA',
      bankId: '006',
      aval: false,
      productName: 'ITAU C AH                ',
      productAlias: 'ITAU C AH',
      productType: 'SDA',
      productNumber: '987654',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '2006698' },
      contraction: 'IC'
    },
    {
      productBank: 'BANCO ITAU CORPBANCA COLOMBIA',
      bankId: '006',
      aval: false,
      productName: 'ensayo                   ',
      productAlias: 'ensayo',
      productType: 'SDA',
      productNumber: '873294283',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '53475324' },
      contraction: 'E'
    },
    {
      productBank: 'BANCO ITAU CORPBANCA COLOMBIA',
      bankId: '006',
      aval: false,
      productName: 'Itau chafis              ',
      productAlias: 'Itau chafis',
      productType: 'SDA',
      productNumber: '3108383838',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '34567' },
      contraction: 'IC'
    },
    {
      productBank: 'BANCOLOMBIA',
      bankId: '007',
      aval: false,
      productName: 'NPJ cte JAS              ',
      productAlias: 'NPJ cte JAS',
      productType: 'DDA',
      productNumber: '3456789',
      description: 'Corriente',
      priority: '3',
      customer: { identificationType: 'NJ', identificationNumber: '800123456' },
      contraction: 'NC'
    },
    {
      productBank: 'BANCOLOMBIA',
      bankId: '007',
      aval: false,
      productName: 'Prueba logo              ',
      productAlias: 'Prueba Logo',
      productType: 'SDA',
      productNumber: '98652314',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '876543' },
      contraction: 'PL'
    },
    {
      productBank: 'BANCOLOMBIA',
      bankId: '007',
      aval: false,
      productName: 'Cuenta Bancolombia       ',
      productAlias: 'C ah Bancolombia',
      productType: 'SDA',
      productNumber: '987654321',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '40999999' },
      contraction: 'CA'
    },
    {
      productBank: 'ITAU',
      bankId: '014',
      aval: false,
      productName: 'Pedro Perez              ',
      productAlias: 'Pedro Pérez Tílde',
      productType: 'SDA',
      productNumber: '456789',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '6789894' },
      contraction: 'PP'
    },
    {
      productBank: 'SCOTIABANK COLPATRIA',
      bankId: '019',
      aval: false,
      productName: 'juana                    ',
      productAlias: 'juanana',
      productType: 'SDA',
      productNumber: '5443225',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '1038377263' },
      contraction: 'J'
    },
    {
      productBank: 'SCOTIABANK COLPATRIA',
      bankId: '019',
      aval: false,
      productName: 'juanana                  ',
      productAlias: 'juananaa',
      productType: 'SDA',
      productNumber: '23545423',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '1092837465' },
      contraction: 'J'
    },
    {
      productBank: 'BANCO DE OCCIDENTE',
      bankId: '023',
      aval: true,
      productName: 'Test Occidente           ',
      productAlias: 'Test Occidente AVAL',
      productType: 'SDA',
      productNumber: '00000000802800003',
      description: 'Ahorros',
      priority: '2',
      customer: { identificationType: 'CC', identificationNumber: '40786876' },
      contraction: 'TO'
    },
    {
      productBank: 'BANCO CAJA SOCIAL',
      bankId: '032',
      aval: false,
      productName: 'Nit 9 digitos            ',
      productAlias: 'Nit 9 digitos',
      productType: 'SDA',
      productNumber: '876543',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'NJ', identificationNumber: '800123456' },
      contraction: 'ND'
    },
    {
      productBank: 'BANCO DAVIVIENDA',
      bankId: '051',
      aval: false,
      productName: 'PRB Davivienda           ',
      productAlias: 'PRB Davivienda',
      productType: 'SDA',
      productNumber: '123456789',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '12345' },
      contraction: 'PD'
    },
    {
      productBank: 'BANCO DAVIVIENDA',
      bankId: '051',
      aval: false,
      productName: 'David Vienda             ',
      productAlias: 'David Vienda',
      productType: 'SDA',
      productNumber: '34567890987',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '9876545' },
      contraction: 'DV'
    },
    {
      productBank: 'BANCO AV VILLAS',
      bankId: '052',
      aval: true,
      productName: 'Cah Villas               ',
      productAlias: 'Cah Villas',
      productType: 'SDA',
      productNumber: '00000000008404683',
      description: 'Ahorros',
      priority: '2',
      customer: { identificationType: 'CC', identificationNumber: '23456789' },
      contraction: 'CV'
    },
    {
      productBank: 'BANCO AV VILLAS',
      bankId: '052',
      aval: true,
      productName: 'Johan Prb                ',
      productAlias: 'Johan prueba',
      productType: 'SDA',
      productNumber: '00000000370000788',
      description: 'Ahorros',
      priority: '2',
      customer: { identificationType: 'CC', identificationNumber: '6799999' },
      contraction: 'JP'
    },
    {
      productBank: 'BANCO AV VILLAS',
      bankId: '052',
      aval: true,
      productName: 'Erepfp pfepfpefkpekf     ',
      productAlias: 'Erepfp pfepfpefkpekf',
      productType: 'SDA',
      productNumber: '00000032334354545',
      description: 'Ahorros',
      priority: '2',
      customer: { identificationType: 'CC', identificationNumber: '4512171' },
      contraction: 'EP'
    },
    {
      productBank: 'BANCAMIA',
      bankId: '059',
      aval: false,
      productName: 'Juan                     ',
      productAlias: 'Juan',
      productType: 'DDA',
      productNumber: '289869846',
      description: 'Corriente',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '1015444444' },
      contraction: 'J'
    },
    {
      productBank: 'BANCAMIA',
      bankId: '059',
      aval: false,
      productName: 'Prueba                   ',
      productAlias: 'Prueba',
      productType: 'DDA',
      productNumber: '1234567890',
      description: 'Corriente',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '1015440000' },
      contraction: 'P'
    },
    {
      productBank: 'LULO BANK S.A.',
      bankId: '070',
      aval: false,
      productName: 'Lulo BnK                 ',
      productAlias: 'Lulo BnK',
      productType: 'SDA',
      productNumber: '456789',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '5678987' },
      contraction: 'LB'
    },
    {
      productBank: 'RAPPIPAY',
      bankId: '151',
      aval: false,
      productName: 'Rap Pili                 ',
      productAlias: 'Rap Pili',
      productType: 'CMA',
      productNumber: '098765',
      description: 'Deposito electronico',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '876543' },
      contraction: 'RP'
    },
    {
      productBank: 'RAPPIPAY',
      bankId: '151',
      aval: false,
      productName: 'Pili rappipay ag         ',
      productAlias: 'Pili rappipay ag',
      productType: 'CMA',
      productNumber: '345678',
      description: 'Deposito electronico',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '45678' },
      contraction: 'PR'
    },
    {
      productBank: 'RAPPIPAY',
      bankId: '151',
      aval: false,
      productName: 'Pili rppay 2021          ',
      productAlias: 'Pili rppay 2021',
      productType: 'CMA',
      productNumber: '456787',
      description: 'Deposito electronico',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '4567887' },
      contraction: 'PR'
    },
    {
      productBank: 'RAPPIPAY',
      bankId: '151',
      aval: false,
      productName: 'Rppy pili                ',
      productAlias: 'Rppy pili',
      productType: 'CMA',
      productNumber: '3108383838',
      description: 'Deposito electronico',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '34567' },
      contraction: 'RP'
    },
    {
      productBank: 'COOFINEP COOPERATIVA FINANCIERA',
      bankId: '291',
      aval: false,
      productName: 'Cta Coofinep             ',
      productAlias: 'Cta Coofinep',
      productType: 'SDA',
      productNumber: '1234567890',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '6785949' },
      contraction: 'CC'
    },
    {
      productBank: 'CONFIAR COOPERATIVA FINANCIERA',
      bankId: '292',
      aval: false,
      productName: 'Confia Pili              ',
      productAlias: 'Confia Pili',
      productType: 'CMA',
      productNumber: '345678',
      description: 'Deposito electronico',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '345678' },
      contraction: 'CP'
    },
    {
      productBank: 'NEQUI',
      bankId: '507',
      aval: false,
      productName: 'Nequi Bcolombia          ',
      productAlias: 'Nequi',
      productType: 'SDA',
      productNumber: '6574839',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '456789' },
      contraction: 'N'
    },
    {
      productBank: 'NEQUI',
      bankId: '507',
      aval: false,
      productName: 'Nequi Test               ',
      productAlias: 'Cuenta Nequi',
      productType: 'SDA',
      productNumber: '3009876789',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '6789098' },
      contraction: 'CN'
    },
    {
      productBank: 'DAVIPLATA',
      bankId: '551',
      aval: false,
      productName: 'Daviplata Review         ',
      productAlias: 'Daviplata Review',
      productType: 'CMA',
      productNumber: '3106757487',
      description: 'Deposito electronico',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '40987654' },
      contraction: 'DR'
    },
    {
      productBank: 'DAVIPLATA',
      bankId: '551',
      aval: false,
      productName: 'Pili Daviplata ag        ',
      productAlias: 'Pili Daviplata ag',
      productType: 'CMA',
      productNumber: '3107575757',
      description: 'Deposito electronico',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '4567876' },
      contraction: 'PD'
    },
    {
      productBank: 'DAVIPLATA',
      bankId: '551',
      aval: false,
      productName: 'Pili david plata         ',
      productAlias: 'Pili david plata',
      productType: 'CMA',
      productNumber: '3108383838',
      description: 'Deposito electronico',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '345678' },
      contraction: 'PD'
    },
    {
      productBank: 'BANCO CREDIFINANCIERA S.A',
      bankId: '558',
      aval: false,
      productName: 'Review Credifinancie     ',
      productAlias: 'Review Credifinancie',
      productType: 'SDA',
      productNumber: '3456789',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '456789' },
      contraction: 'RC'
    },
    {
      productBank: 'BANCO CREDIFINANCIERA S.A',
      bankId: '558',
      aval: false,
      productName: 'cta credifinanciera      ',
      productAlias: 'cta credifinanciera',
      productType: 'SDA',
      productNumber: '987654321',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '6789054' },
      contraction: 'CC'
    },
    {
      productBank: 'FOGAFIN',
      bankId: '684',
      aval: false,
      productName: 'Fogafin Daniel           ',
      productAlias: 'Fogafin Daniel',
      productType: 'SDA',
      productNumber: '234567',
      description: 'Ahorros',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '234567' },
      contraction: 'FD'
    },
    {
      productBank: 'MOVII',
      bankId: '801',
      aval: false,
      productName: 'Movii PAP                ',
      productAlias: 'Movii PAP',
      productType: 'CMA',
      productNumber: '30008989',
      description: 'Deposito electronico',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '4567890' },
      contraction: 'MP'
    },
    {
      productBank: 'MOVII',
      bankId: '801',
      aval: false,
      productName: 'Movii pili               ',
      productAlias: 'Movii pili',
      productType: 'CMA',
      productNumber: '58584895',
      description: 'Deposito electronico',
      priority: '3',
      customer: { identificationType: 'CC', identificationNumber: '6885859' },
      contraction: 'MP'
    },
    {
      productBank: 'BANCO DE BOGOTA',
      bankId: '001',
      aval: true,
      productName: 'CUENTA PROPIA',
      productAlias: 'Cuenta de Ahorros',
      productType: 'SDA',
      productNumber: '00000019817337',
      description: 'Ahorros',
      priority: '1',
      customer: { identificationType: 'CC', identificationNumber: '2006698' },
      contraction: 'CD'
    },
    {
      productBank: 'BANCO DE BOGOTA',
      bankId: '001',
      aval: true,
      productName: 'CUENTA PROPIA',
      productAlias: 'Cuenta de Ahorros',
      productType: 'SDA',
      productNumber: '00000019904804',
      description: 'Ahorros',
      priority: '1',
      customer: { identificationType: 'CC', identificationNumber: '2006698' },
      contraction: 'CD'
    },
    {
      productBank: 'BANCO DE BOGOTA',
      bankId: '001',
      aval: true,
      productName: 'CUENTA PROPIA',
      productAlias: 'Cuenta de Ahorros',
      productType: 'SDA',
      productNumber: '00000000163824',
      description: 'Ahorros',
      priority: '1',
      customer: { identificationType: 'CC', identificationNumber: '2006698' },
      contraction: 'CD'
    },
    {
      productBank: 'BANCO DE BOGOTA',
      bankId: '001',
      aval: true,
      productName: 'CUENTA PROPIA',
      productAlias: 'Cuenta Corriente',
      productType: 'DDA',
      productNumber: '0019817386',
      description: 'Corriente',
      priority: '1',
      customer: { identificationType: 'CC', identificationNumber: '2006698' },
      contraction: 'CC'
    }
  ]
};

export const getScheduledResponse = {
  scheduleTransfersResponseList: [
    {
      destinationAccountHolderIdType: 'CC',
      destinationAccountHolderIdNumber: '2006699',
      amount: '4444.00',
      scheduleId: '434',
      nextExecutionDate: '2029-11-25T00:00:00.000Z',
      scheduledCount: 0,
      pendingCount: 0,
      description: 'Caso Final de mes',
      frequency: 'MONTHLY',
      accountFrom: { acctId: '0019904804', acctType: 'SDA', bankId: '0001', bankName: 'BANCO DE BOGOTA' },
      accountTo: { acctId: '0019817386', acctType: 'SDA', bankId: '0013', bankName: 'BBVA COLOMBIA' },
      status: 'PENDING',
      recurrent: true
    },
    {
      destinationAccountHolderIdType: 'CC',
      destinationAccountHolderIdNumber: '2006698',
      amount: '100000.00',
      scheduleId: '461',
      nextExecutionDate: '2029-10-21T00:00:00.000Z',
      scheduledCount: 12,
      pendingCount: 12,
      description: 'Test Mensualida',
      frequency: 'WEEKLY',
      accountFrom: { acctId: '0000163824', acctType: 'SDA', bankId: '0001', bankName: 'BANCO DE BOGOTA' },
      accountTo: { acctId: '00000000114136872', acctType: 'SDA', bankId: '0013', bankName: 'BBVA COLOMBIA' },
      status: 'ERROR',
      recurrent: true
    },
    {
      destinationAccountHolderIdType: 'CC',
      destinationAccountHolderIdNumber: '2006698',
      amount: '100000.00',
      scheduleId: '462',
      nextExecutionDate: '2029-11-11T00:00:00.000Z',
      scheduledCount: 12,
      pendingCount: 7,
      description: 'Mensualidad Carro',
      frequency: 'BIWEEKLY',
      accountFrom: { acctId: '0115026973', acctType: 'SDA', bankId: '0001', bankName: 'BANCO DE BOGOTA' },
      accountTo: { acctId: '00000000000331223', acctType: 'SDA', bankId: '0013', bankName: 'BBVA COLOMBIA' },
      status: 'PENDING',
      recurrent: true
    },
    {
      destinationAccountHolderIdType: 'CC',
      destinationAccountHolderIdNumber: '1023954643',
      amount: '1234.00',
      scheduleId: '469',
      nextExecutionDate: '2029-01-01T00:00:00.000Z',
      scheduledCount: 0,
      pendingCount: 0,
      description: 'elmes',
      frequency: 'DAILY',
      accountFrom: { acctId: '0019817337', acctType: 'SDA', bankId: '0001', bankName: 'BANCO DE BOGOTA' },
      accountTo: { acctId: '00000000041481888', acctType: 'SDA', bankId: '1001', bankName: 'BANCO DE BOGOTA' },
      status: 'PENDING',
      recurrent: true
    }
  ]
};

export const productsWithBalance = [
  {
    productName: 'Cuenta de Ahorros LibreAhorro',
    description: 'AH Cuota Administración',
    officeId: '0019',
    productAthType: 'ST',
    productBankType: ProductTypes.SAVINGS_ACCOUNT,
    productBankSubType: '061AH',
    productNumber: '0019904804',
    valid: true,
    franchise: '',
    openDate: '2021-02-24',
    balanceDetail: {
      Current: '100.000',
      PendAuthAmt: '0',
      Avail: '100.000'
    }
  },
  {
    productName: 'Cuenta de Ahorros LibreAhorro',
    description: 'AH Cuota Administración',
    officeId: '0019',
    productAthType: 'ST',
    productBankType: ProductTypes.SAVINGS_ACCOUNT,
    productBankSubType: '061AH',
    productNumber: '0019817337',
    valid: true,
    franchise: '',
    openDate: '2019-10-10'
  },
  {
    productName: 'Cuenta Corriente Comercial',
    description: 'CC Cuentas comerciales',
    officeId: '0019',
    productAthType: 'IM',
    productBankType: ProductTypes.CHECK_ACCOUNT,
    productBankSubType: '010CC',
    productNumber: '0019817386',
    valid: true,
    franchise: '',
    openDate: '2019-10-10',
    balanceDetail: {
      Current: '100.000',
      PendAuthAmt: '0',
      Avail: '200.000',
      CashLimit: '600.000'
    }
  }
];

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

export const getScheduledCatalogsResponse = {
  catalogItems: [
    {
      id: 'ANNUALLY',
      name: 'Cada año',
      catalogName: 'SCHEDULED_TRANSFERS_FREQUENCY'
    },
    {
      id: 'TWICEMONTHLY',
      name: 'Cada dos meses',
      catalogName: 'SCHEDULED_TRANSFERS_FREQUENCY'
    },
    {
      id: 'BIWEEKLY',
      name: 'Cada dos semanas',
      catalogName: 'SCHEDULED_TRANSFERS_FREQUENCY'
    },
    {
      id: 'MONTHLY',
      name: 'Cada mes',
      catalogName: 'SCHEDULED_TRANSFERS_FREQUENCY'
    },
    {
      id: 'WEEKLY',
      name: 'Cada semana',
      catalogName: 'SCHEDULED_TRANSFERS_FREQUENCY'
    },
    {
      id: 'QUARTERLY',
      name: 'Cada tres meses',
      catalogName: 'SCHEDULED_TRANSFERS_FREQUENCY'
    },
    {
      id: 'ENDOFMONTH',
      name: 'El último día del mes',
      catalogName: 'SCHEDULED_TRANSFERS_FREQUENCY'
    },
    {
      id: 'ONLY_ONCE',
      name: 'Solo una vez',
      catalogName: 'SCHEDULED_TRANSFERS_FREQUENCY'
    },
    {
      id: 'DAILY',
      name: 'Todos los días',
      catalogName: 'SCHEDULED_TRANSFERS_FREQUENCY'
    }
  ]
};

export const createScheduledRequest = {
  accountFrom: { accountType: 'SDA', accountId: '0019904804', bankId: '0001' },
  accountTo: { accountType: 'SDA', accountId: '12345678', bankId: '1001' },
  nextExecutionDate: '2022-01-01',
  amount: '123456',
  destinationAccountHolderIdNumber: '2006699',
  destinationAccountHolderIdType: 'CC',
  description: 'Netflix',
  frequency: 'ONLY_ONCE',
  countType: TRANSFER_COUNT_TYPE.REPEAT,
  count: 15
};

export const modifyScheduledRequest = {
  accountFrom: { accountType: 'SDA', accountId: '0019904804', bankId: '0001' },
  accountTo: { accountType: 'SDA', accountId: '12345678', bankId: '1001' },
  amount: '444402',
  count: 4,
  countType: TRANSFER_COUNT_TYPE.REPEAT,
  description: 'Test desc',
  destinationAccountHolderIdNumber: '2006699',
  destinationAccountHolderIdType: 'CC',
  frequency: 'ONLY_ONCE',
  nextExecutionDate: '2021-11-25',
  scheduledId: '436'
};

export const createScheduledResponse = { approvalId: '469', message: 'operation success', requestId: '1234' };

export const deleteAccountResponse = { approvalId: '456', message: 'Account delete', requestId: '123' };

export const doTransferResponse = { approvalId: '456', message: 'Account delete', requestId: '123' };
export const addAccountResponse = { message: 'Account affiliation Operation success' };

export const getBankListCatalogsResponse = {
  catalogItems: [
    {
      id: '001',
      name: 'BANCO DE BOGOTA',
      catalogName: 'BANK_LIST',
      customFields: {
        isActiveMB: 'true',
        isAval: 'true',
        type: 'bank',
        isActive: 'true'
      },
      order: 0
    },
    {
      id: '551',
      name: 'DAVIPLATA',
      catalogName: 'BANK_LIST',
      customFields: {
        isActiveMB: 'true',
        isAval: 'false',
        type: 'electronicDeposit',
        isActive: 'true'
      },
      order: 0
    }
  ]
};

export const getCostListResponse = {
  catalogItems: [
    {
      catalogName: 'VALOR_TRANSACCIONES',
      id: 'ACH_TRANSFER',
      name: '6.480 + IVA',
      order: 0,
      parentId: '2022'
    },
    {
      catalogName: 'VALOR_TRANSACCIONES',
      id: 'CASH_ADVANCE',
      name: DEFAULT_TRANSACTION_COST,
      order: 0,
      parentId: '2022'
    }
  ]
};

export const getBalancesResponse = {
  productBalanceInfoList: [
    {
      accountId: '0019904804',
      accountType: 'SDA',
      status: '00',
      balanceDetail: {
        Avail: '32999056.00',
        CashAvail: '0.00',
        CashLimit: '0.00',
        PendAuthAmt: '0.00',
        LastStmBal: '33351369.00',
        CashAvail2: '0.00',
        Current: '32999056.00'
      }
    },
    {
      accountId: '0019817386',
      accountType: 'DDA',
      status: '00',
      balanceDetail: {
        Avail: '133574383.00',
        CashAvail: '0.00',
        CashLimit: '0.00',
        PendAuthAmt: '0.00',
        LastStmBal: '133574383.00',
        CashAvail2: '0.00',
        Current: '133574383.00'
      }
    }
  ]
};

const server = setupServer(
  rest.post('/api-gateway/user-features/get-user-settings', (req, res, ctx) => res(ctx.json(getUserSettingsResponse))),
  rest.post('/api-gateway/products/get-all', (req, res, ctx) => res(ctx.json(getProductsResponse))),
  rest.post('/api-gateway/transfer-account/scheduled', (req, res, ctx) => res(ctx.json(getScheduledResponse))),
  rest.post('/api-gateway/transfer-account/add-scheduled', (req, res, ctx) => res(ctx.json(createScheduledResponse))),
  rest.post('/api-gateway/transfer-account/modify-scheduled', (req, res, ctx) =>
    res(ctx.json(createScheduledResponse))
  ),
  rest.post('/api-gateway/transfer-account/delete-scheduled', (req, res, ctx) =>
    res(ctx.json(createScheduledResponse))
  ),
  rest.post('/api-gateway/transfer-core/get-affiliated-accounts', (req, res, ctx) =>
    res(ctx.json(getAffiliatedAcctsResponse))
  ),
  rest.post('/api-gateway/validation/validate-otp', (req, res, ctx) =>
    res(
      ctx.json({
        approvalId: '801084'
      })
    )
  ),
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
  ),
  rest.post('/api-gateway/transfer-core/delete-account', (req, res, ctx) => res(ctx.json(deleteAccountResponse))),
  rest.post('/api-gateway/transfer-account/do-transfer', (req, res, ctx) => res(ctx.json(doTransferResponse))),
  rest.post('/api-gateway/user-features/get-catalog', (req: MockedRequest<GetCatalogRq>, res, ctx) => {
    const catalogRq = req.body.catalogName;
    switch (catalogRq) {
      case CATALOG_NAME.SCHEDULED_TRANSFERS_FREQUENCY:
        return res(ctx.json(getScheduledCatalogsResponse));
      case CATALOG_NAME.BANK_LIST:
        return res(ctx.json(getBankListCatalogsResponse));
      default:
        return res(ctx.json(getCostListResponse));
    }
  }),
  rest.post('/api-gateway/transfer-core/delete-account', (req, res, ctx) => res(ctx.json(deleteAccountResponse))),
  rest.post('/api-gateway/transfer-core/add-account', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(addAccountResponse))
  ),
  rest.post('/api-gateway/products-detail/balances/batch-inquiry', (req, res, ctx) =>
    res(ctx.json(getBalancesResponse))
  ),
  rest.post('/api-gateway/internal-transfer/credit-card-advance/add', (req, res, ctx) =>
    res(
      ctx.json({
        message: 'Operation success',
        approvalId: '002688'
      })
    )
  )
);

export default server;
