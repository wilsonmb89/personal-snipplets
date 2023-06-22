/**
 *
 AFC  Cuenta AFC
 DDA  Cuenta Corriente
 SDA  Cuenta de Ahorro
 CDA  CDT
 DLA  Credito
 CCA  Tarjeta de Credito
 LOC  Credito
 LPA  Puntos por Todo
 MDA  Pensiones Obligatorias
 SBA  Cesantias
 VDA  Pensiones Voluntarias
 FDA  Fiducia
 */
export type accountsTypes = 'AFC' | 'DDA' | 'SDA' | 'CDA' | 'DLA' | 'CCA' | 'LOC' | 'LPA' | 'MDA' | 'SBA' | 'VDA';

export const PRODUCTS_CONST = {
  accountNames: {
    AFC: 'Cuenta AFC',
    DDA: 'Cuenta Corriente',
    SDA: 'Cuenta de Ahorro',
    CDA: 'CDT',
    DLA: 'Crédito',
    CCA: 'Tarjeta de Crédito',
    LOC: 'Crédito Libranza',
    LPA: 'Puntos por Todo',
    MDA: 'Pensiones Obligatorias',
    SBA: 'Cesantías',
    VDA: 'Pensiones Voluntarias',
    FDA: 'Fiducia'
  }
};

export enum BankProductTypes {
  AFC = 'AFC',
  DDA = 'DDA',
  SDA = 'SDA',
  CDA = 'CDA',
  DLA = 'DLA',
  CCA = 'CCA',
  LOC = 'LOC',
  LPA = 'LPA',
  MDA = 'MDA',
  SBA = 'SBA',
  VDA = 'VDA',
  FDA = 'FDA'
}

export enum ATHTypes {
  ST = 'ST', // cuenta ahorros
  IM = 'IM', // cuenta corriente
  MC = 'MC', // tarjeta mastercard
  BNPL = 'BNPL', // tarjeta cero pay
  CB = 'CB', // tarjeta visa
  FB = 'FB', // fiducia
  AF = 'AF', // AFC
  LF = 'LF', // credito leasing
  LH = 'LH', // credito leasing
  AD = 'AD', // creditos...
  AN = 'AN', // credito crediservice
  DN = 'DN', // credito adelanto nomina
  AV = 'AV', // credito vivienda
  LB = 'LB', // credito libranza
  LA = 'LA', // credito anticipo leasing
  AP = 'AP' // credito crediservice
}
