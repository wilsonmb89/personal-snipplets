export enum ProductTypes {
  SAVINGS_ACCOUNT = 'SDA',
  CHECK_ACCOUNT = 'DDA',
  ELECTRONIC_DEPOSIT = 'CMA',
  CREDIT_CARD = 'CCA',
  LOAN = 'LOC',
  CDT = 'CDA',
  FIDUCIARY = 'FDA'
}

export enum ProductAthTypes {
  SAVINGS_ACCOUNT = 'ST',
  CHECK_ACCOUNT = 'IM',
  CREDIT_CARD_VISA = 'CB',
  CREDIT_CARD_MASTERCARD = 'MC',
  CREDIT_SERVICE_AP = 'AP',
  CREDIT_SERVICE_ALS = 'AN',
  FIDUCIARY = 'FB'
}

export type ProductAthType = `${ProductAthTypes}`;

export type ProductType = `${ProductTypes}`;

export const BANK_TYPES = {
  SAVINGS_ACCOUNT: {
    code: ProductTypes.SAVINGS_ACCOUNT,
    athType: ProductAthTypes.SAVINGS_ACCOUNT,
    name: 'Cuenta de Ahorros'
  },
  CHECK_ACCOUNT: {
    code: ProductTypes.CHECK_ACCOUNT,
    athType: ProductAthTypes.CHECK_ACCOUNT,
    name: 'Cuenta Corriente'
  },
  CREDIT_CARD: {
    code: ProductTypes.CREDIT_CARD,
    athType: ProductAthTypes.CREDIT_CARD_VISA || ProductAthTypes.CREDIT_CARD_MASTERCARD,
    name: 'Tarjeta de Crédito'
  },
  FIDUCIARY: {
    code: ProductTypes.FIDUCIARY,
    athType: ProductAthTypes.FIDUCIARY,
    name: 'Fiduciara'
  },
  CREDIT: {
    code: ProductTypes.LOAN,
    athType: ProductAthTypes.CREDIT_SERVICE_ALS || ProductAthTypes.CREDIT_SERVICE_AP,
    name: 'Crediservice'
  }
};

export const PRODUCT_TYPES = [
  { id: 0, text: 'Ahorros', value: ProductTypes.SAVINGS_ACCOUNT },
  { id: 1, text: 'Corriente', value: ProductTypes.CHECK_ACCOUNT },
  { id: 2, text: 'Depósito electronico', value: ProductTypes.ELECTRONIC_DEPOSIT }
];

export enum ACCOUNT_SUBTYPES {
  ST = '062',
  AF = '067',
  IM = '010CC'
}

export const BANK_SUBTYPES = {
  AFC: {
    code: '067AH'
  }
};

export const BANK_INFO = {
  BBOG: {
    name: 'BANCO DE BOGOTA',
    bankId: '001',
    aval: true
  }
};

export const BRANCH_ID = 'DIG';

export const ELECTRONIC_DEPOSIT_CATALOG = 'electronicDeposit';

export const CREDIT_CARD_STATES = {
  BLOCKED: ['K', 'M', 'Y'],
  FROZEN: ['P', 'U'],
  INDEBT: ['A', 'B', 'C', 'D', 'E'],
  WRONG_PIN: ['L']
};

export enum CREDIT_CARD_TYPES {
  MASTER_CARD = 'mastercard',
  VISA = 'visa'
}
