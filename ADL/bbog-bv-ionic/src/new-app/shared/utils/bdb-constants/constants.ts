import { ConstantsModel } from './constants.model';

export const CONST: ConstantsModel = {
  document_types: [
    { name: 'Cédula de ciudadanía', value: 'C', analyticsCode: '3', valueopt: 'CC', valueAsLoginForm: 'C.C.' },
    { name: 'Tarjeta de Identidad', value: 'T', analyticsCode: '2' , valueopt: 'TI', valueAsLoginForm: 'T.I.'},
    { name: 'Cédula de Extranjería', value: 'E', analyticsCode: '5' , valueopt: 'CE', valueAsLoginForm: 'C.E.' },
    { name: 'NIT Persona Natural', value: 'L', analyticsCode: '7' , valueopt: 'NI', valueAsLoginForm: 'N.P.N.'},
    { name: 'NIT Persona Extranjera', value: 'I', analyticsCode: '7' , valueopt: 'NE', valueAsLoginForm: 'N.P.E.'},
    { name: 'NIT Persona Jurídica', value: 'N', analyticsCode: '7' , valueopt: 'NJ', valueAsLoginForm: 'N.P.J.'},
    { name: 'Pasaporte', value: 'P', analyticsCode: '4' , valueopt: 'PA', valueAsLoginForm: 'P.S.'},
    { name: 'Registro Civil', value: 'R', analyticsCode: '1', valueopt: 'RC', valueAsLoginForm: 'R.C.' }
  ]
};

export function getValueDocumentTypeOpt(input: any): string {
  // TODO delete when massify new authenticator
  const findType = CONST.document_types.find(obj => obj.value === input);
  if (findType) {
    return findType.valueopt;
  } else {
    return input;
  }
}

export function getArrayDocTypes(): string[] {
  return CONST.document_types.map(doc => doc.valueopt);
}

export function getValueDocumentTypeAsLoginForm(input: any): string {
  return CONST.document_types.find(docType => docType.valueopt === input || docType.value === input).valueAsLoginForm ;
}
