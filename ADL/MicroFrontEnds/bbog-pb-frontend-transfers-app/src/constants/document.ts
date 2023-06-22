export enum Documents {
  CC = 'CC',
  TI = 'TI',
  CE = 'CE',
  NI = 'NI',
  NE = 'NE',
  NJ = 'NJ',
  PA = 'PA',
  RC = 'RC'
}

export enum DocumentsName {
  CC = 'C.C.   Cédula de ciudadanía',
  TI = 'T.I.   Tarjeta de Identidad',
  CE = 'C.E.   Cédula de Extranjería',
  NI = 'N.P.N. NIT Persona Natural',
  NE = 'N.P.E. NIT Persona Extranjera',
  NJ = 'N.P.J. NIT Persona Jurídica',
  PA = 'P.S.   Pasaporte',
  RC = 'R.C.   Registro Civil'
}

export type DocumentType = `${Documents}`;

export interface Document {
  text: DocumentsName;
  value: DocumentType;
}

export const DOCUMENTS_INFO: Document[] = [
  { text: DocumentsName.CC, value: Documents.CC },
  { text: DocumentsName.TI, value: Documents.TI },
  { text: DocumentsName.CE, value: Documents.CE },
  { text: DocumentsName.NI, value: Documents.NI },
  { text: DocumentsName.NE, value: Documents.NE },
  { text: DocumentsName.NJ, value: Documents.NJ },
  { text: DocumentsName.PA, value: Documents.PA },
  { text: DocumentsName.RC, value: Documents.RC }
];
